import { Component, inject, signal, OnInit } from '@angular/core';
import { BoardComponent } from '../../components/board/board.component';
import { SudokuApiService } from '../../../../core/services';
import { Board } from '../../../../models';
import { apiBoardToBoard, createEmptyBoard } from '../../../../utils/board.util';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [BoardComponent],
  templateUrl: './game-page.component.html',
})
export class GamePageComponent implements OnInit {
  private readonly api = inject(SudokuApiService);

  board = signal<Board>(createEmptyBoard());
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadBoard();
  }

  loadBoard(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.api.getBoard('easy').subscribe({
      next: (response) => {
        this.board.set(apiBoardToBoard(response.board));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load puzzle');
        this.isLoading.set(false);
      },
    });
  }
}
