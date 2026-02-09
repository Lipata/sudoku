import { Component, input, output, effect } from '@angular/core';

export type PopupType = 'message' | 'confirm';
export type PopupVariant = 'success' | 'error' | 'warning';

@Component({
  selector: 'app-popup',
  standalone: true,
  templateUrl: './popup.component.html',
})
export class PopupComponent {
  type = input<PopupType>('message');
  variant = input<PopupVariant>('warning');
  message = input.required<string>();
  autoHideMs = input<number | null>(null);

  confirmed = output<void>();
  cancelled = output<void>();
  closed = output<void>();

  constructor() {
    effect(() => {
      const ms = this.autoHideMs();
      if (ms && ms > 0) {
        setTimeout(() => this.closed.emit(), ms);
      }
    });
  }

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
