import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-number-pad',
  standalone: true,
  templateUrl: './number-pad.component.html',
})
export class NumberPadComponent {
  disabled = input(false);

  numberSelected = output<number>();

  readonly numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  onNumberClick(num: number): void {
    this.numberSelected.emit(num);
  }
}
