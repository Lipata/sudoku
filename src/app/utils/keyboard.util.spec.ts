import { describe, it, expect } from 'vitest';
import {
  isNavigationKey,
  getNextPosition,
  isNumberKey,
  isClearKey,
  isEscapeKey,
  isTabKey,
  isHomeKey,
  isEndKey,
  isPageUpKey,
  isPageDownKey,
  getRowStart,
  getRowEnd,
  getColumnStart,
  getColumnEnd,
} from './keyboard.util';

describe('keyboard.util', () => {
  describe('isNavigationKey', () => {
    it('returns true for arrow keys', () => {
      expect(isNavigationKey('ArrowUp')).toBe(true);
      expect(isNavigationKey('ArrowDown')).toBe(true);
      expect(isNavigationKey('ArrowLeft')).toBe(true);
      expect(isNavigationKey('ArrowRight')).toBe(true);
    });

    it('returns true for WASD keys', () => {
      expect(isNavigationKey('w')).toBe(true);
      expect(isNavigationKey('a')).toBe(true);
      expect(isNavigationKey('s')).toBe(true);
      expect(isNavigationKey('d')).toBe(true);
      expect(isNavigationKey('W')).toBe(true);
      expect(isNavigationKey('A')).toBe(true);
      expect(isNavigationKey('S')).toBe(true);
      expect(isNavigationKey('D')).toBe(true);
    });

    it('returns false for other keys', () => {
      expect(isNavigationKey('Enter')).toBe(false);
      expect(isNavigationKey('Space')).toBe(false);
      expect(isNavigationKey('1')).toBe(false);
      expect(isNavigationKey('x')).toBe(false);
    });
  });

  describe('getNextPosition', () => {
    it('moves up correctly', () => {
      expect(getNextPosition({ row: 5, col: 3 }, 'ArrowUp')).toEqual({ row: 4, col: 3 });
      expect(getNextPosition({ row: 5, col: 3 }, 'w')).toEqual({ row: 4, col: 3 });
      expect(getNextPosition({ row: 5, col: 3 }, 'W')).toEqual({ row: 4, col: 3 });
    });

    it('moves down correctly', () => {
      expect(getNextPosition({ row: 5, col: 3 }, 'ArrowDown')).toEqual({ row: 6, col: 3 });
      expect(getNextPosition({ row: 5, col: 3 }, 's')).toEqual({ row: 6, col: 3 });
      expect(getNextPosition({ row: 5, col: 3 }, 'S')).toEqual({ row: 6, col: 3 });
    });

    it('moves left correctly', () => {
      expect(getNextPosition({ row: 5, col: 3 }, 'ArrowLeft')).toEqual({ row: 5, col: 2 });
      expect(getNextPosition({ row: 5, col: 3 }, 'a')).toEqual({ row: 5, col: 2 });
      expect(getNextPosition({ row: 5, col: 3 }, 'A')).toEqual({ row: 5, col: 2 });
    });

    it('moves right correctly', () => {
      expect(getNextPosition({ row: 5, col: 3 }, 'ArrowRight')).toEqual({ row: 5, col: 4 });
      expect(getNextPosition({ row: 5, col: 3 }, 'd')).toEqual({ row: 5, col: 4 });
      expect(getNextPosition({ row: 5, col: 3 }, 'D')).toEqual({ row: 5, col: 4 });
    });

    it('clamps to top boundary', () => {
      expect(getNextPosition({ row: 0, col: 3 }, 'ArrowUp')).toEqual({ row: 0, col: 3 });
    });

    it('clamps to bottom boundary', () => {
      expect(getNextPosition({ row: 8, col: 3 }, 'ArrowDown')).toEqual({ row: 8, col: 3 });
    });

    it('clamps to left boundary', () => {
      expect(getNextPosition({ row: 5, col: 0 }, 'ArrowLeft')).toEqual({ row: 5, col: 0 });
    });

    it('clamps to right boundary', () => {
      expect(getNextPosition({ row: 5, col: 8 }, 'ArrowRight')).toEqual({ row: 5, col: 8 });
    });

    it('defaults to (0,0) when current is null', () => {
      expect(getNextPosition(null, 'ArrowDown')).toEqual({ row: 1, col: 0 });
      expect(getNextPosition(null, 'ArrowRight')).toEqual({ row: 0, col: 1 });
    });
  });

  describe('isNumberKey', () => {
    it('returns true for 1-9', () => {
      for (let i = 1; i <= 9; i++) {
        expect(isNumberKey(String(i))).toBe(true);
      }
    });

    it('returns false for 0', () => {
      expect(isNumberKey('0')).toBe(false);
    });

    it('returns false for non-number keys', () => {
      expect(isNumberKey('a')).toBe(false);
      expect(isNumberKey('Enter')).toBe(false);
    });
  });

  describe('isClearKey', () => {
    it('returns true for Backspace', () => {
      expect(isClearKey('Backspace')).toBe(true);
    });

    it('returns true for Delete', () => {
      expect(isClearKey('Delete')).toBe(true);
    });

    it('returns false for other keys', () => {
      expect(isClearKey('Escape')).toBe(false);
      expect(isClearKey('0')).toBe(false);
    });
  });

  describe('isEscapeKey', () => {
    it('returns true for Escape', () => {
      expect(isEscapeKey('Escape')).toBe(true);
    });

    it('returns false for other keys', () => {
      expect(isEscapeKey('Enter')).toBe(false);
      expect(isEscapeKey('Esc')).toBe(false);
    });
  });

  describe('isTabKey', () => {
    it('returns true for Tab', () => {
      expect(isTabKey('Tab')).toBe(true);
    });

    it('returns false for other keys', () => {
      expect(isTabKey('Enter')).toBe(false);
    });
  });

  describe('isHomeKey', () => {
    it('returns true for Home', () => {
      expect(isHomeKey('Home')).toBe(true);
    });

    it('returns false for other keys', () => {
      expect(isHomeKey('End')).toBe(false);
    });
  });

  describe('isEndKey', () => {
    it('returns true for End', () => {
      expect(isEndKey('End')).toBe(true);
    });

    it('returns false for other keys', () => {
      expect(isEndKey('Home')).toBe(false);
    });
  });

  describe('getRowStart', () => {
    it('returns column 0 of current row', () => {
      expect(getRowStart({ row: 5, col: 7 })).toEqual({ row: 5, col: 0 });
    });

    it('defaults to row 0 when current is null', () => {
      expect(getRowStart(null)).toEqual({ row: 0, col: 0 });
    });
  });

  describe('getRowEnd', () => {
    it('returns column 8 of current row', () => {
      expect(getRowEnd({ row: 3, col: 2 })).toEqual({ row: 3, col: 8 });
    });

    it('defaults to row 0 when current is null', () => {
      expect(getRowEnd(null)).toEqual({ row: 0, col: 8 });
    });
  });

  describe('isPageUpKey', () => {
    it('returns true for PageUp', () => {
      expect(isPageUpKey('PageUp')).toBe(true);
    });

    it('returns false for other keys', () => {
      expect(isPageUpKey('PageDown')).toBe(false);
      expect(isPageUpKey('Home')).toBe(false);
    });
  });

  describe('isPageDownKey', () => {
    it('returns true for PageDown', () => {
      expect(isPageDownKey('PageDown')).toBe(true);
    });

    it('returns false for other keys', () => {
      expect(isPageDownKey('PageUp')).toBe(false);
      expect(isPageDownKey('End')).toBe(false);
    });
  });

  describe('getColumnStart', () => {
    it('returns row 0 of current column', () => {
      expect(getColumnStart({ row: 5, col: 7 })).toEqual({ row: 0, col: 7 });
    });

    it('defaults to column 0 when current is null', () => {
      expect(getColumnStart(null)).toEqual({ row: 0, col: 0 });
    });
  });

  describe('getColumnEnd', () => {
    it('returns row 8 of current column', () => {
      expect(getColumnEnd({ row: 3, col: 4 })).toEqual({ row: 8, col: 4 });
    });

    it('defaults to column 0 when current is null', () => {
      expect(getColumnEnd(null)).toEqual({ row: 8, col: 0 });
    });
  });
});
