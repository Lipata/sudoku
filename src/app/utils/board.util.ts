import { ApiBoard, Board } from '../models';

export function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({
      value: 0,
      isPrefilled: false,
    }))
  );
}

export function apiBoardToBoard(apiBoard: ApiBoard): Board {
  return apiBoard.map((row) =>
    row.map((value) => ({
      value,
      isPrefilled: value !== 0,
    }))
  );
}

export function boardToApiBoard(board: Board): ApiBoard {
  return board.map((row) => row.map((cell) => cell.value));
}
