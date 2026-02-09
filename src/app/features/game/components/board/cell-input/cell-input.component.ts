import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-cell-input',
  standalone: true,
  templateUrl: './cell-input.component.html',
})
export class CellInputComponent {
  disabledNumbers = input<number[]>([]);

  numberSelected = output<number>();
  closed = output<void>();

  availableNumbers = computed(() => {
    const disabled = this.disabledNumbers();
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !disabled.includes(n));
  });

  onSelect(num: number): void {
    this.numberSelected.emit(num);
  }

  onClear(): void {
    this.numberSelected.emit(0);
  }

  onBackdropClick(): void {
    this.closed.emit();
  }
}
