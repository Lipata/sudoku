import { Component, input } from '@angular/core';
import { Board } from '../../../../models';
import { CellComponent } from './cell/cell.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CellComponent],
  templateUrl: './board.component.html',
})
export class BoardComponent {
  board = input.required<Board>();
}
