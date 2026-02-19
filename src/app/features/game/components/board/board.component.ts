import { Component, computed, input, model } from '@angular/core';
import { Board, CellPosition, Difficulty } from '../../../../models';
import { CellComponent } from './cell/cell.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CellComponent],
  templateUrl: './board.component.html',
})
export class BoardComponent {
  board = input.required<Board>();
  selectedCell = model<CellPosition | null>(null);
  invalidCell = input<CellPosition | null>(null);
  difficulty = input<Difficulty | null>(null);

  highlightedNumber = computed(() => {
    const diff = this.difficulty();
    if (diff !== 'easy' && diff !== 'medium') return null;

    const selected = this.selectedCell();
    if (!selected) return null;
    const { row, col } = selected;
    return this.board()[row][col].value;
  });
}
