import { Component, DestroyRef, inject, input, output, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

export type PopupType = 'message' | 'confirm';
export type PopupVariant = 'success' | 'error' | 'warning';

@Component({
  selector: 'app-popup',
  standalone: true,
  templateUrl: './popup.component.html',
})
export class PopupComponent {
  private readonly destroyRef = inject(DestroyRef);

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
        timer(ms).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.closed.emit());
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
