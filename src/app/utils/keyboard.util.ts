import { CellPosition } from '../models';

type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
type WASDCode = 'KeyW' | 'KeyA' | 'KeyS' | 'KeyD';
type NavigationKey = ArrowKey | WASDCode;

const NAVIGATION_KEYS: Record<NavigationKey, { row: number; col: number }> = {
  ArrowUp: { row: -1, col: 0 },
  ArrowDown: { row: 1, col: 0 },
  ArrowLeft: { row: 0, col: -1 },
  ArrowRight: { row: 0, col: 1 },
  KeyW: { row: -1, col: 0 },
  KeyS: { row: 1, col: 0 },
  KeyA: { row: 0, col: -1 },
  KeyD: { row: 0, col: 1 },
};

export function isNavigationKey(keyOrCode: string): keyOrCode is NavigationKey {
  return keyOrCode in NAVIGATION_KEYS;
}

export function getNavigationKey(event: KeyboardEvent): NavigationKey | null {
  if (event.key in NAVIGATION_KEYS) {
    return event.key as NavigationKey;
  }
  if (event.code in NAVIGATION_KEYS) {
    return event.code as NavigationKey;
  }
  return null;
}

export function getNextPosition(current: CellPosition | null, key: NavigationKey): CellPosition {
  const { row = 0, col = 0 } = current ?? {};
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

export function isPageUpKey(key: string): boolean {
  return key === 'PageUp';
}

export function isPageDownKey(key: string): boolean {
  return key === 'PageDown';
}

export function getColumnStart(current: CellPosition | null): CellPosition {
  return { row: 0, col: current?.col ?? 0 };
}

export function getColumnEnd(current: CellPosition | null): CellPosition {
  return { row: 8, col: current?.col ?? 0 };
}
