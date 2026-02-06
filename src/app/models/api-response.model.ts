import { Difficulty } from './board.model';

export type ApiBoard = Array<Array<number>>;

// GET /board?difficulty=easy
export type BoardResponse = {
  board: ApiBoard;
};

// Request body for POST endpoints
export type SudokuRequest = {
  board: ApiBoard;
};

// POST /solve
export type SolveResponse = {
  difficulty: Difficulty;
  solution: ApiBoard;
  status: 'solved' | 'broken' | 'unsolvable';
};

// POST /validate
export type ValidateResponse = {
  status: 'solved' | 'broken';
};
