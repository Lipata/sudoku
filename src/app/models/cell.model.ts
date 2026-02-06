export interface Cell {
  value: number;        // 0-9 (0 = empty)
  isPrefilled: boolean; // true if from API (cannot be edited)
}

export interface CellPosition {
  row: number;  // 0-8
  col: number;  // 0-8
}
