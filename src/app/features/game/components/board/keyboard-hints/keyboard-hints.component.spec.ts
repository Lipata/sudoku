import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyboardHintsComponent } from './keyboard-hints.component';

describe('KeyboardHintsComponent', () => {
  let component: KeyboardHintsComponent;
  let fixture: ComponentFixture<KeyboardHintsComponent>;

  const getKeyTexts = (): string[] => {
    const keys = fixture.nativeElement.querySelectorAll('.key') as NodeListOf<HTMLElement>;
    return Array.from(keys).map(k => k.textContent?.trim() ?? '');
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyboardHintsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyboardHintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigation mode', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('mode', 'navigation');
      fixture.detectChanges();
    });

    it('should show WASD keys', () => {
      const keyTexts = getKeyTexts();
      expect(keyTexts).toContain('W');
      expect(keyTexts).toContain('A');
      expect(keyTexts).toContain('S');
      expect(keyTexts).toContain('D');
    });

    it('should show arrow keys', () => {
      const keyTexts = getKeyTexts();
      expect(keyTexts).toContain('↑');
      expect(keyTexts).toContain('←');
      expect(keyTexts).toContain('↓');
      expect(keyTexts).toContain('→');
    });

    it('should show Tab key', () => {
      const keyTexts = getKeyTexts();
      expect(keyTexts).toContain('Tab');
    });

    it('should show Home and End keys', () => {
      const keyTexts = getKeyTexts();
      expect(keyTexts).toContain('Home');
      expect(keyTexts).toContain('End');
    });

    it('should show PgUp and PgDn keys', () => {
      const keyTexts = getKeyTexts();
      expect(keyTexts).toContain('PgUp');
      expect(keyTexts).toContain('PgDn');
    });

    it('should not show number keys', () => {
      const keyTexts = getKeyTexts();
      expect(keyTexts).not.toContain('1');
      expect(keyTexts).not.toContain('9');
    });
  });

  describe('input mode', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('mode', 'input');
      fixture.detectChanges();
    });

    it('should show number keys 1 and 9', () => {
      const keyTexts = getKeyTexts();
      expect(keyTexts).toContain('1');
      expect(keyTexts).toContain('9');
    });

    it('should show backspace key', () => {
      const keyTexts = getKeyTexts();
      expect(keyTexts).toContain('⌫');
    });

    it('should show Esc key', () => {
      const keyTexts = getKeyTexts();
      expect(keyTexts).toContain('Esc');
    });

    it('should not show WASD keys', () => {
      const keyTexts = getKeyTexts();
      expect(keyTexts).not.toContain('W');
      expect(keyTexts).not.toContain('A');
      expect(keyTexts).not.toContain('S');
      expect(keyTexts).not.toContain('D');
    });

    it('should show enter label', () => {
      const text = fixture.nativeElement.textContent;
      expect(text).toContain('enter');
    });

    it('should show clear label', () => {
      const text = fixture.nativeElement.textContent;
      expect(text).toContain('clear');
    });

    it('should show deselect label', () => {
      const text = fixture.nativeElement.textContent;
      expect(text).toContain('deselect');
    });
  });

  describe('default mode', () => {
    it('should default to navigation mode', () => {
      expect(component.mode()).toBe('navigation');
    });
  });
});
