import { Board } from '../models';

export function isValidPlacement(board: Board, row: number, col: number, value: number): boolean {
  if (value === 0) return true;

  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c].value === value) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col].value === value) return false;
  }

  // Check 3x3 box
  const boxRowStart = Math.floor(row / 3) * 3;
  const boxColStart = Math.floor(col / 3) * 3;
  for (let r = boxRowStart; r < boxRowStart + 3; r++) {
    for (let c = boxColStart; c < boxColStart + 3; c++) {
      if (r !== row && c !== col && board[r][c].value === value) return false;
    }
  }

  return true;
}

export function getInvalidNumbers(board: Board, row: number, col: number): number[] {
  const invalid: number[] = [];

  for (let num = 1; num <= 9; num++) {
    if (!isValidPlacement(board, row, col, num)) {
      invalid.push(num);
    }
  }

  return invalid;
}
