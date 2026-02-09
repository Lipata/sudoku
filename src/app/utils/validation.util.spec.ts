import { describe, it, expect } from 'vitest';
import { isValidPlacement } from './validation.util';
import { Board } from '../models';

function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: 0, isPrefilled: false }))
  );
}

describe('validation.util', () => {
  describe('isValidPlacement', () => {
    it('returns true for valid placement in empty board', () => {
      const board = createEmptyBoard();
      expect(isValidPlacement(board, 0, 0, 5)).toBe(true);
    });

    it('returns true for value 0 (clear)', () => {
      const board = createEmptyBoard();
      board[0][1].value = 5;
      expect(isValidPlacement(board, 0, 0, 0)).toBe(true);
    });

    it('returns false when same number exists in row', () => {
      const board = createEmptyBoard();
      board[0][5].value = 7;
      expect(isValidPlacement(board, 0, 0, 7)).toBe(false);
    });

    it('returns false when same number exists in column', () => {
      const board = createEmptyBoard();
      board[5][0].value = 3;
      expect(isValidPlacement(board, 0, 0, 3)).toBe(false);
    });

    it('returns false when same number exists in 3x3 box', () => {
      const board = createEmptyBoard();
      board[1][1].value = 9;
      expect(isValidPlacement(board, 0, 0, 9)).toBe(false);
    });

    it('returns true when same number exists outside 3x3 box', () => {
      const board = createEmptyBoard();
      board[3][3].value = 4; // Different box
      expect(isValidPlacement(board, 0, 0, 4)).toBe(true);
    });

    it('checks all 3x3 boxes correctly', () => {
      const board = createEmptyBoard();

      // Place 5 in center of each box and verify
      const boxCenters = [
        [1, 1], [1, 4], [1, 7],
        [4, 1], [4, 4], [4, 7],
        [7, 1], [7, 4], [7, 7],
      ];

      // Test middle box (4,4)
      board[4][4].value = 5;

      // Same box positions should be invalid
      expect(isValidPlacement(board, 3, 3, 5)).toBe(false);
      expect(isValidPlacement(board, 5, 5, 5)).toBe(false);

      // Different box positions should be valid (if not in same row/col)
      expect(isValidPlacement(board, 0, 0, 5)).toBe(true);
      expect(isValidPlacement(board, 8, 8, 5)).toBe(true);
    });

    it('allows placing number when only conflict is the cell itself', () => {
      const board = createEmptyBoard();
      board[0][0].value = 5;
      // Replacing the same cell should be valid
      expect(isValidPlacement(board, 0, 0, 5)).toBe(true);
    });
  });
});
