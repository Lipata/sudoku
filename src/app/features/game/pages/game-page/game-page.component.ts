import { Component, HostListener, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { BoardComponent } from '../../components/board/board.component';
import { NumberPadComponent } from '../../components/board/number-pad/number-pad.component';
import { SudokuApiService } from '../../../../core/services';
import { Board, Difficulty, CellPosition } from '../../../../models';
import { apiBoardToBoard, boardToApiBoard, createEmptyBoard } from '../../../../utils/board.util';
import { isNavigationKey, getNextPosition, isNumberKey, isClearKey } from '../../../../utils/keyboard.util';
import { isValidPlacement } from '../../../../utils/validation.util';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [BoardComponent, NumberPadComponent, TitleCasePipe],
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
  pendingAction = signal<'solve' | 'newGame' | null>(null);

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

        // Auto-clear "broken" message after 3 seconds
        if (response.status === 'broken') {
          setTimeout(() => {
            if (this.validationStatus() === 'broken') {
              this.validationStatus.set(null);
            }
          }, 3000);
        }
      },
      error: () => {
        this.error.set('Failed to validate puzzle');
        this.isValidating.set(false);
      },
    });
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
