import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GamePageComponent } from './game-page.component';
import { SudokuApiService } from '../../../../core/services';
import { Board, ApiBoard } from '../../../../models';

function createTestBoard(): Board {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: 0, isPrefilled: false }))
  );
}

function createTestApiBoard(): ApiBoard {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));
}

describe('GamePageComponent', () => {
  let component: GamePageComponent;
  let mockApiService: {
    validate: ReturnType<typeof vi.fn>;
    solve: ReturnType<typeof vi.fn>;
    getBoard: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockApiService = {
      validate: vi.fn(),
      solve: vi.fn(),
      getBoard: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: SudokuApiService, useValue: mockApiService },
      ],
    });

    component = TestBed.runInInjectionContext(() => new GamePageComponent());
    component.board.set(createTestBoard());
    component.gameStarted.set(true);
  });

  describe('setCellValue', () => {
    it('updates cell value when cell is selected', () => {
      component.selectedCell.set({ row: 0, col: 0 });
      component.setCellValue(5);

      expect(component.board()[0][0].value).toBe(5);
    });

    it('does nothing when no cell is selected', () => {
      component.selectedCell.set(null);
      component.setCellValue(5);

      expect(component.board()[0][0].value).toBe(0);
    });

    it('does not update prefilled cells', () => {
      const board = createTestBoard();
      board[0][0] = { value: 3, isPrefilled: true };
      component.board.set(board);
      component.selectedCell.set({ row: 0, col: 0 });

      component.setCellValue(5);

      expect(component.board()[0][0].value).toBe(3);
    });

    it('clears cell when value is 0', () => {
      component.selectedCell.set({ row: 0, col: 0 });
      component.setCellValue(5);
      component.setCellValue(0);

      expect(component.board()[0][0].value).toBe(0);
    });
  });

  describe('easy mode validation', () => {
    beforeEach(() => {
      component.selectedDifficulty.set('easy');
    });

    it('allows valid placement', () => {
      component.selectedCell.set({ row: 0, col: 0 });
      component.setCellValue(5);

      expect(component.board()[0][0].value).toBe(5);
      expect(component.invalidCell()).toBeNull();
    });

    it('shows invalid feedback for row conflict', () => {
      const board = createTestBoard();
      board[0][5].value = 7;
      component.board.set(board);
      component.selectedCell.set({ row: 0, col: 0 });

      component.setCellValue(7);

      expect(component.invalidCell()).toEqual({ row: 0, col: 0 });
    });

    it('shows invalid feedback for column conflict', () => {
      const board = createTestBoard();
      board[5][0].value = 3;
      component.board.set(board);
      component.selectedCell.set({ row: 0, col: 0 });

      component.setCellValue(3);

      expect(component.invalidCell()).toEqual({ row: 0, col: 0 });
    });

    it('shows invalid feedback for box conflict', () => {
      const board = createTestBoard();
      board[1][1].value = 9;
      component.board.set(board);
      component.selectedCell.set({ row: 0, col: 0 });

      component.setCellValue(9);

      expect(component.invalidCell()).toEqual({ row: 0, col: 0 });
    });

    it('clears invalid feedback after timeout', async () => {
      vi.useFakeTimers();

      const board = createTestBoard();
      board[0][5].value = 7;
      component.board.set(board);
      component.selectedCell.set({ row: 0, col: 0 });

      component.setCellValue(7);

      expect(component.invalidCell()).toEqual({ row: 0, col: 0 });
      expect(component.board()[0][0].value).toBe(7);

      vi.advanceTimersByTime(500);

      expect(component.invalidCell()).toBeNull();
      expect(component.board()[0][0].value).toBe(0);

      vi.useRealTimers();
    });

    it('allows clearing with 0 even with conflicts', () => {
      const board = createTestBoard();
      board[0][0].value = 5;
      board[0][5].value = 5; // Conflict exists
      component.board.set(board);
      component.selectedCell.set({ row: 0, col: 0 });

      component.setCellValue(0);

      expect(component.board()[0][0].value).toBe(0);
      expect(component.invalidCell()).toBeNull();
    });
  });

  describe('non-easy mode', () => {
    it('allows invalid placements in medium mode', () => {
      component.selectedDifficulty.set('medium');
      const board = createTestBoard();
      board[0][5].value = 7;
      component.board.set(board);
      component.selectedCell.set({ row: 0, col: 0 });

      component.setCellValue(7);

      expect(component.board()[0][0].value).toBe(7);
      expect(component.invalidCell()).toBeNull();
    });

    it('allows invalid placements in hard mode', () => {
      component.selectedDifficulty.set('hard');
      const board = createTestBoard();
      board[0][5].value = 7;
      component.board.set(board);
      component.selectedCell.set({ row: 0, col: 0 });

      component.setCellValue(7);

      expect(component.board()[0][0].value).toBe(7);
      expect(component.invalidCell()).toBeNull();
    });
  });

  describe('showNumberPad', () => {
    it('is initially hidden', () => {
      expect(component.showNumberPad()).toBe(false);
    });

    it('can be toggled on', () => {
      component.showNumberPad.set(true);
      expect(component.showNumberPad()).toBe(true);
    });

    it('can be toggled off', () => {
      component.showNumberPad.set(true);
      component.showNumberPad.set(false);
      expect(component.showNumberPad()).toBe(false);
    });
  });

  describe('backToMenu', () => {
    it('sets gameStarted to false', () => {
      component.gameStarted.set(true);
      component.backToMenu();
      expect(component.gameStarted()).toBe(false);
    });

    it('clears error', () => {
      component.error.set('Some error');
      component.backToMenu();
      expect(component.error()).toBeNull();
    });

    it('clears validationStatus', () => {
      component.validationStatus.set('solved');
      component.backToMenu();
      expect(component.validationStatus()).toBeNull();
    });
  });

  describe('validateBoard', () => {
    it('sets isValidating to true while validating', () => {
      mockApiService.validate.mockReturnValue(of({ status: 'solved' }));

      component.validateBoard();

      expect(mockApiService.validate).toHaveBeenCalled();
    });

    it('sets validationStatus to solved on success', () => {
      mockApiService.validate.mockReturnValue(of({ status: 'solved' }));

      component.validateBoard();

      expect(component.validationStatus()).toBe('solved');
      expect(component.isValidating()).toBe(false);
    });

    it('sets validationStatus to broken for invalid board', () => {
      mockApiService.validate.mockReturnValue(of({ status: 'broken' }));

      component.validateBoard();

      expect(component.validationStatus()).toBe('broken');
      expect(component.isValidating()).toBe(false);
    });

    it('sets error on API failure', () => {
      mockApiService.validate.mockReturnValue(throwError(() => new Error('API Error')));

      component.validateBoard();

      expect(component.error()).toBe('Failed to validate puzzle');
      expect(component.isValidating()).toBe(false);
    });
  });

  describe('solveBoard (via confirmation)', () => {
    it('updates board with solution on success', () => {
      const solutionBoard = createTestApiBoard();
      solutionBoard[0][0] = 5;
      mockApiService.solve.mockReturnValue(of({
        status: 'solved',
        solution: solutionBoard,
        difficulty: 'easy',
      }));

      component.requestAction('solve');
      component.confirmAction();

      expect(component.board()[0][0].value).toBe(5);
      expect(component.validationStatus()).toBe('solved');
      expect(component.isSolving()).toBe(false);
    });

    it('sets error for unsolvable board', () => {
      mockApiService.solve.mockReturnValue(of({ status: 'unsolvable' }));

      component.requestAction('solve');
      component.confirmAction();

      expect(component.error()).toBe('Puzzle cannot be solved');
      expect(component.isSolving()).toBe(false);
    });

    it('sets error on API failure', () => {
      mockApiService.solve.mockReturnValue(throwError(() => new Error('API Error')));

      component.requestAction('solve');
      component.confirmAction();

      expect(component.error()).toBe('Failed to solve puzzle');
      expect(component.isSolving()).toBe(false);
    });
  });

  describe('requestAction and confirmAction', () => {
    it('sets pendingAction when requestAction is called', () => {
      component.requestAction('solve');
      expect(component.pendingAction()).toBe('solve');
    });

    it('clears pendingAction when cancelAction is called', () => {
      component.requestAction('solve');
      component.cancelAction();
      expect(component.pendingAction()).toBeNull();
    });

    it('calls backToMenu when confirming newGame', () => {
      component.gameStarted.set(true);
      component.requestAction('newGame');
      component.confirmAction();
      expect(component.gameStarted()).toBe(false);
    });
  });

  describe('onKeyDown', () => {
    it('ignores keys when game not started', () => {
      component.gameStarted.set(false);
      component.selectedCell.set({ row: 0, col: 0 });

      const event = new KeyboardEvent('keydown', { key: '5' });
      component.onKeyDown(event);

      expect(component.board()[0][0].value).toBe(0);
    });

    it('handles arrow key navigation', () => {
      component.selectedCell.set({ row: 4, col: 4 });

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      vi.spyOn(event, 'preventDefault');
      component.onKeyDown(event);

      expect(component.selectedCell()).toEqual({ row: 3, col: 4 });
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('handles WASD navigation', () => {
      component.selectedCell.set({ row: 4, col: 4 });

      const event = new KeyboardEvent('keydown', { key: 's', code: 'KeyS' });
      component.onKeyDown(event);

      expect(component.selectedCell()).toEqual({ row: 5, col: 4 });
    });

    it('handles number key input', () => {
      component.selectedCell.set({ row: 0, col: 0 });

      const event = new KeyboardEvent('keydown', { key: '7' });
      component.onKeyDown(event);

      expect(component.board()[0][0].value).toBe(7);
    });

    it('handles backspace to clear', () => {
      component.selectedCell.set({ row: 0, col: 0 });
      component.setCellValue(5);

      const event = new KeyboardEvent('keydown', { key: 'Backspace' });
      component.onKeyDown(event);

      expect(component.board()[0][0].value).toBe(0);
    });

    it('ignores number keys when no cell selected', () => {
      component.selectedCell.set(null);

      const event = new KeyboardEvent('keydown', { key: '5' });
      component.onKeyDown(event);

      expect(component.board()[0][0].value).toBe(0);
    });
  });
});
