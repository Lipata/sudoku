import { CellPosition } from '../models';

type NavigationKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'w' | 'a' | 's' | 'd' | 'W' | 'A' | 'S' | 'D';

const NAVIGATION_KEYS: Record<NavigationKey, { row: number; col: number }> = {
  ArrowUp: { row: -1, col: 0 },
  ArrowDown: { row: 1, col: 0 },
  ArrowLeft: { row: 0, col: -1 },
  ArrowRight: { row: 0, col: 1 },
  w: { row: -1, col: 0 },
  W: { row: -1, col: 0 },
  s: { row: 1, col: 0 },
  S: { row: 1, col: 0 },
  a: { row: 0, col: -1 },
  A: { row: 0, col: -1 },
  d: { row: 0, col: 1 },
  D: { row: 0, col: 1 },
};

export function isNavigationKey(key: string): key is NavigationKey {
  return key in NAVIGATION_KEYS;
}

export function getNextPosition(current: CellPosition | null, key: NavigationKey): CellPosition {
  const row = current?.row ?? 0;
  const col = current?.col ?? 0;
  const delta = NAVIGATION_KEYS[key];

  return {
    row: Math.max(0, Math.min(8, row + delta.row)),
    col: Math.max(0, Math.min(8, col + delta.col)),
  };
}

export function isNumberKey(key: string): boolean {
  return key >= '1' && key <= '9';
}

export function isClearKey(key: string): boolean {
  return key === 'Backspace' || key === 'Delete';
}

export function isEscapeKey(key: string): boolean {
  return key === 'Escape';
}

export function isTabKey(key: string): boolean {
  return key === 'Tab';
}

export function isHomeKey(key: string): boolean {
  return key === 'Home';
}

export function isEndKey(key: string): boolean {
  return key === 'End';
}

export function getRowStart(current: CellPosition | null): CellPosition {
  return { row: current?.row ?? 0, col: 0 };
}

export function getRowEnd(current: CellPosition | null): CellPosition {
  return { row: current?.row ?? 0, col: 8 };
}
