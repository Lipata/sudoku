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
  invalidCell = input<CellPosition | null>(null);
  highlightedNumber = input<number | null>(null);

  isSelected = computed(() => {
    const selected = this.selectedCell();
    return selected?.row === this.row() && selected?.col === this.col();
  });

  isInvalid = computed(() => {
    const invalid = this.invalidCell();
    return invalid?.row === this.row() && invalid?.col === this.col();
  });

  isHighlighted = computed(() => {
    const highlighted = this.highlightedNumber();
    const cellValue = this.cell().value;
    return highlighted !== null && highlighted !== 0 && cellValue === highlighted && !this.isSelected();
  });

  onClick(): void {
    this.selectedCell.set({ row: this.row(), col: this.col() });
  }
}
