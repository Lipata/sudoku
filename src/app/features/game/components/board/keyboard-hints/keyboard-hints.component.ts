import { Component, input } from '@angular/core';

export type HintsMode = 'navigation' | 'input';

@Component({
  selector: 'app-keyboard-hints',
  standalone: true,
  templateUrl: './keyboard-hints.component.html',
  styleUrls: ['./keyboard-hints.component.css'],
})
export class KeyboardHintsComponent {
  mode = input<HintsMode>('navigation');
}
