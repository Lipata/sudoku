import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CellInputComponent } from './cell-input.component';

describe('CellInputComponent', () => {
  let component: CellInputComponent;
  let fixture: ComponentFixture<CellInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CellInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('availableNumbers', () => {
    it('should return all numbers 1-9 when no disabled numbers', () => {
      expect(component.availableNumbers()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should filter out disabled numbers', () => {
      fixture.componentRef.setInput('disabledNumbers', [1, 5, 9]);
      fixture.detectChanges();

      expect(component.availableNumbers()).toEqual([2, 3, 4, 6, 7, 8]);
    });

    it('should return empty array when all numbers are disabled', () => {
      fixture.componentRef.setInput('disabledNumbers', [1, 2, 3, 4, 5, 6, 7, 8, 9]);
      fixture.detectChanges();

      expect(component.availableNumbers()).toEqual([]);
    });
  });

  describe('onSelect', () => {
    it('should emit numberSelected with the selected number', () => {
      const spy = vi.fn();
      component.numberSelected.subscribe(spy);

      component.onSelect(5);

      expect(spy).toHaveBeenCalledWith(5);
    });
  });

  describe('onClear', () => {
    it('should emit numberSelected with 0', () => {
      const spy = vi.fn();
      component.numberSelected.subscribe(spy);

      component.onClear();

      expect(spy).toHaveBeenCalledWith(0);
    });
  });

  describe('onBackdropClick', () => {
    it('should emit closed event', () => {
      const spy = vi.fn();
      component.closed.subscribe(spy);

      component.onBackdropClick();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('template', () => {
    it('should render available number buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll('.cell-input-number');
      expect(buttons.length).toBe(9);
      expect(buttons[0].textContent.trim()).toBe('1');
      expect(buttons[8].textContent.trim()).toBe('9');
    });

    it('should hide disabled number buttons', () => {
      fixture.componentRef.setInput('disabledNumbers', [1, 2, 3]);
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('.cell-input-number');
      expect(buttons.length).toBe(6);
      expect(buttons[0].textContent.trim()).toBe('4');
    });

    it('should render Clear button', () => {
      const clearButton = fixture.nativeElement.querySelector('.cell-input-clear');
      expect(clearButton).toBeTruthy();
      expect(clearButton.textContent.trim()).toBe('Clear');
    });

    it('should call onSelect when number button clicked', () => {
      const spy = vi.spyOn(component, 'onSelect');
      const buttons = fixture.nativeElement.querySelectorAll('.cell-input-number');

      buttons[0].click();

      expect(spy).toHaveBeenCalledWith(1);
    });

    it('should call onClear when Clear button clicked', () => {
      const spy = vi.spyOn(component, 'onClear');
      const clearButton = fixture.nativeElement.querySelector('.cell-input-clear');

      clearButton.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should call onBackdropClick when backdrop clicked', () => {
      const spy = vi.spyOn(component, 'onBackdropClick');
      const backdrop = fixture.nativeElement.querySelector('.cell-input-backdrop');

      backdrop.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should not call onBackdropClick when popup content clicked', () => {
      const spy = vi.spyOn(component, 'onBackdropClick');
      const popup = fixture.nativeElement.querySelector('.cell-input-popup');

      popup.click();

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
