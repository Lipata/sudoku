import { Cell } from './cell.model';

export type Board = Array<Array<Cell>>;

export type Difficulty = 'easy' | 'medium' | 'hard' | 'random';

export type GameStatus = 'idle' | 'loading' | 'playing' | 'won';
