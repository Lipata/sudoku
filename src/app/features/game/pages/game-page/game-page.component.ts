import { Component, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { BoardComponent } from '../../components/board/board.component';
import { SudokuApiService } from '../../../../core/services';
import { Board, Difficulty } from '../../../../models';
import { apiBoardToBoard, createEmptyBoard } from '../../../../utils/board.util';

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

  readonly difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'random'];

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
