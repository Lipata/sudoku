import { Component, input } from '@angular/core';
import { Board } from '../../../../models';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
})
export class BoardComponent {
  board = input.required<Board>();
}
