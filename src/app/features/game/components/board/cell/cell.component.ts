import { Component, computed, input, model } from '@angular/core';
import { Cell, CellPosition } from '../../../../../models';

@Component({
  selector: 'app-cell',
  standalone: true,
  templateUrl: './cell.component.html',
})
export class CellComponent {
  cell = input.required<Cell>();
  row = input.required<number>();
  col = input.required<number>();
  selectedCell = model<CellPosition | null>(null);

  isSelected = computed(() => {
    const selected = this.selectedCell();
    return selected?.row === this.row() && selected?.col === this.col();
  });

  onClick(): void {
    this.selectedCell.set({ row: this.row(), col: this.col() });
  }
}
