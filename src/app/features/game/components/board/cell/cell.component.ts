import { Component, input } from '@angular/core';
import { Cell } from '../../../../../models';

@Component({
  selector: 'app-cell',
  standalone: true,
  templateUrl: './cell.component.html',
})
export class CellComponent {
  cell = input.required<Cell>();
  row = input.required<number>();
  col = input.required<number>();
}
