import { Component, HostListener, inject, signal, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { BoardComponent } from '../../components/board/board.component';
import { NumberPadComponent } from '../../components/board/number-pad/number-pad.component';
import { PopupComponent } from '../../components/board/popup/popup.component';
import { CellInputComponent } from '../../components/board/cell-input/cell-input.component';
import { SudokuApiService } from '../../../../core/services';
import { Board, Difficulty, CellPosition } from '../../../../models';
import { apiBoardToBoard, boardToApiBoard, createEmptyBoard } from '../../../../utils/board.util';
import {
  isNavigationKey,
  getNextPosition,
  isNumberKey,
  isClearKey,
  isEscapeKey,
  isTabKey,
  isHomeKey,
  isEndKey,
  getRowStart,
  getRowEnd,
} from '../../../../utils/keyboard.util';
import { isValidPlacement, getInvalidNumbers } from '../../../../utils/validation.util';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [BoardComponent, NumberPadComponent, PopupComponent, CellInputComponent, TitleCasePipe],
  templateUrl: './game-page.component.html',
})
export class GamePageComponent {
  private readonly api = inject(SudokuApiService);

  // Game state
  board = signal<Board>(createEmptyBoard());
  gameStarted = signal(false);
  selectedDifficulty = signal<Difficulty | null>(null);

  // Cell selection
  selectedCell = signal<CellPosition | null>(null);
  invalidCell = signal<CellPosition | null>(null);

  // Loading and status
  isLoading = signal(false);
  isValidating = signal(false);
  isSolving = signal(false);
  error = signal<string | null>(null);
  validationStatus = signal<'solved' | 'broken' | null>(null);

  // UI
  showNumberPad = signal(false);
  showCellInput = signal(false);
  pendingAction = signal<'solve' | 'newGame' | null>(null);

  // Computed: disabled numbers for easy mode cell input
  disabledNumbers = computed(() => {
    const selected = this.selectedCell();
    if (!selected || this.selectedDifficulty() !== 'easy') return [];
    return getInvalidNumbers(this.board(), selected.row, selected.col);
  });

  readonly difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'random'];

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.gameStarted()) return;

    const key = event.key;

    if (isNavigationKey(key)) {
      event.preventDefault();
      this.selectedCell.set(getNextPosition(this.selectedCell(), key));
      return;
    }

    if (isEscapeKey(key)) {
      this.selectedCell.set(null);
      return;
    }

    if (isTabKey(key)) {
      event.preventDefault();
      const nextEmpty = this.findNextEmptyCell(event.shiftKey);
      if (nextEmpty) {
        this.selectedCell.set(nextEmpty);
      }
      return;
    }

    if (isHomeKey(key)) {
      event.preventDefault();
      this.selectedCell.set(getRowStart(this.selectedCell()));
      return;
    }

    if (isEndKey(key)) {
      event.preventDefault();
      this.selectedCell.set(getRowEnd(this.selectedCell()));
      return;
    }

    if (!this.selectedCell()) return;

    if (isNumberKey(key)) {
      this.setCellValue(parseInt(key, 10));
      event.preventDefault();
    } else if (isClearKey(key)) {
      this.setCellValue(0);
      event.preventDefault();
    }
  }

  setCellValue(value: number): void {
    const selected = this.selectedCell();
    if (!selected) return;

    const currentBoard = this.board();
    if (currentBoard[selected.row][selected.col].isPrefilled) return;

    // In Easy mode: validate placement
    if (this.selectedDifficulty() === 'easy' && value !== 0) {
      if (!isValidPlacement(currentBoard, selected.row, selected.col, value)) {
        this.showInvalidFeedback(selected, value);
        return;
      }
    }

    this.updateCell(selected, value);
  }

  private showInvalidFeedback(position: CellPosition, value: number): void {
    this.updateCell(position, value);
    this.invalidCell.set(position);

    setTimeout(() => {
      this.updateCell(position, 0);
      this.invalidCell.set(null);
    }, 500);
  }

  private updateCell(position: CellPosition, value: number): void {
    const currentBoard = this.board();
    const newBoard = currentBoard.map((r, rIdx) =>
      r.map((cell, cIdx) =>
        rIdx === position.row && cIdx === position.col ? { ...cell, value } : cell
      )
    );
    this.board.set(newBoard);
  }

  private findNextEmptyCell(reverse: boolean): CellPosition | null {
    const currentBoard = this.board();
    const current = this.selectedCell();
    const startRow = current?.row ?? 0;
    const startCol = current?.col ?? (reverse ? 8 : -1);

    const step = reverse ? -1 : 1;
    let row = startRow;
    let col = startCol + step;

    for (let i = 0; i < 81; i++) {
      if (col > 8) {
        col = 0;
        row = (row + 1) % 9;
      } else if (col < 0) {
        col = 8;
        row = (row - 1 + 9) % 9;
      }

      const cell = currentBoard[row][col];
      if (!cell.isPrefilled && cell.value === 0) {
        return { row, col };
      }

      col += step;
    }

    return null;
  }

  startGame(difficulty: Difficulty): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.selectedDifficulty.set(difficulty);

    this.api.getBoard(difficulty).subscribe({
      next: (response) => {
        this.board.set(apiBoardToBoard(response.board));
        // Use actual difficulty from API if available (for random)
        if (response.difficulty) {
          this.selectedDifficulty.set(response.difficulty);
        }
        this.isLoading.set(false);
        this.gameStarted.set(true);
      },
      error: () => {
        this.error.set('Failed to load puzzle');
        this.isLoading.set(false);
      },
    });
  }

  backToMenu(): void {
    this.gameStarted.set(false);
    this.error.set(null);
    this.validationStatus.set(null);
  }

  validateBoard(): void {
    this.isValidating.set(true);
    this.validationStatus.set(null);

    this.api.validate(boardToApiBoard(this.board())).subscribe({
      next: (response) => {
        this.validationStatus.set(response.status);
        this.isValidating.set(false);
      },
      error: () => {
        this.error.set('Failed to validate puzzle');
        this.isValidating.set(false);
      },
    });
  }

  clearValidationStatus(): void {
    this.validationStatus.set(null);
  }

  onMobileCellSelect(position: CellPosition | null): void {
    if (!position) return;
    const cell = this.board()[position.row][position.col];
    if (!cell.isPrefilled) {
      this.selectedCell.set(position);
      this.showCellInput.set(true);
    }
  }

  onCellInputSelect(value: number): void {
    this.setCellValue(value);
    this.showCellInput.set(false);
  }

  closeCellInput(): void {
    this.showCellInput.set(false);
  }

  requestAction(action: 'solve' | 'newGame'): void {
    this.pendingAction.set(action);
  }

  confirmAction(): void {
    const action = this.pendingAction();
    this.pendingAction.set(null);

    if (action === 'solve') {
      this.solveBoard();
    } else if (action === 'newGame') {
      this.backToMenu();
    }
  }

  cancelAction(): void {
    this.pendingAction.set(null);
  }

  private solveBoard(): void {
    this.isSolving.set(true);
    this.validationStatus.set(null);

    this.api.solve(boardToApiBoard(this.board())).subscribe({
      next: (response) => {
        if (response.status === 'solved') {
          this.board.set(apiBoardToBoard(response.solution));
          this.validationStatus.set('solved');
        } else {
          this.error.set('Puzzle cannot be solved');
        }
        this.isSolving.set(false);
      },
      error: () => {
        this.error.set('Failed to solve puzzle');
        this.isSolving.set(false);
      },
    });
  }
}
