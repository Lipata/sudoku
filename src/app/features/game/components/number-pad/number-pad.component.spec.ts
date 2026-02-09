import { describe, it, expect, vi } from 'vitest';
import { NumberPadComponent } from './number-pad.component';

describe('NumberPadComponent', () => {
  let component: NumberPadComponent;

  beforeEach(() => {
    component = new NumberPadComponent();
  });

  describe('numbers array', () => {
    it('contains numbers 1-9 and 0', () => {
      expect(component.numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
    });

    it('has 10 numbers', () => {
      expect(component.numbers.length).toBe(10);
    });
  });

  describe('onNumberClick', () => {
    it('emits the clicked number', () => {
      const emitSpy = vi.spyOn(component.numberSelected, 'emit');

      component.onNumberClick(5);

      expect(emitSpy).toHaveBeenCalledWith(5);
    });

    it('emits 0 for clear', () => {
      const emitSpy = vi.spyOn(component.numberSelected, 'emit');

      component.onNumberClick(0);

      expect(emitSpy).toHaveBeenCalledWith(0);
    });

    it('emits each number correctly', () => {
      const emitSpy = vi.spyOn(component.numberSelected, 'emit');

      for (const num of component.numbers) {
        component.onNumberClick(num);
        expect(emitSpy).toHaveBeenCalledWith(num);
      }

      expect(emitSpy).toHaveBeenCalledTimes(10);
    });
  });
});
