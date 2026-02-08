import { Component, HostListener, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { BoardComponent } from '../../components/board/board.component';
import { SudokuApiService } from '../../../../core/services';
import { Board, Difficulty, CellPosition } from '../../../../models';
import { apiBoardToBoard, createEmptyBoard } from '../../../../utils/board.util';
import { isNavigationKey, getNextPosition, isNumberKey, isClearKey } from '../../../../utils/keyboard.util';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [BoardComponent, TitleCasePipe],
  templateUrl: './game-page.component.html',
})
export class GamePageComponent {
  private readonly api = inject(SudokuApiService);

  board = signal<Board>(createEmptyBoard());
  isLoading = signal(false);
  error = signal<string | null>(null);
  gameStarted = signal(false);
  selectedDifficulty = signal<Difficulty | null>(null);
  selectedCell = signal<CellPosition | null>(null);

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

    const newBoard = currentBoard.map((r, rIdx) =>
      r.map((cell, cIdx) =>
        rIdx === selected.row && cIdx === selected.col ? { ...cell, value } : cell
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
  }
}
