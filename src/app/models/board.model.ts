import { Cell } from './cell.model';


export type BaseBoard<T> = Array<Array<T>>;

export type Board = BaseBoard<Cell>;

export type ApiBoard = BaseBoard<number>;

export type Difficulty = 'easy' | 'medium' | 'hard' | 'random';

export type GameStatus = 'idle' | 'loading' | 'playing' | 'won';
