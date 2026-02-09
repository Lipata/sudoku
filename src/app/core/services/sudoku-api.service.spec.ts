import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SudokuApiService } from './sudoku-api.service';
import { ApiBoard, Difficulty } from '../../models';

describe('SudokuApiService', () => {
  let service: SudokuApiService;
  let httpMock: HttpTestingController;

  const mockBoard: ApiBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(SudokuApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getBoard', () => {
    it('should fetch a board with easy difficulty', () => {
      service.getBoard('easy').subscribe((response) => {
        expect(response.board).toEqual(mockBoard);
      });

      const req = httpMock.expectOne(
        'https://sugoku.onrender.com/board?difficulty=easy'
      );
      expect(req.request.method).toBe('GET');
      req.flush({ board: mockBoard });
    });

    it('should fetch a board with medium difficulty', () => {
      service.getBoard('medium').subscribe((response) => {
        expect(response.board).toEqual(mockBoard);
      });

      const req = httpMock.expectOne(
        'https://sugoku.onrender.com/board?difficulty=medium'
      );
      expect(req.request.method).toBe('GET');
      req.flush({ board: mockBoard });
    });

    it('should fetch a board with hard difficulty', () => {
      service.getBoard('hard').subscribe((response) => {
        expect(response.board).toEqual(mockBoard);
      });

      const req = httpMock.expectOne(
        'https://sugoku.onrender.com/board?difficulty=hard'
      );
      expect(req.request.method).toBe('GET');
      req.flush({ board: mockBoard });
    });

    it('should fetch a board with random difficulty', () => {
      service.getBoard('random').subscribe((response) => {
        expect(response.board).toEqual(mockBoard);
      });

      const req = httpMock.expectOne(
        'https://sugoku.onrender.com/board?difficulty=random'
      );
      expect(req.request.method).toBe('GET');
      req.flush({ board: mockBoard });
    });
  });

  describe('validate', () => {
    it('should post board and return solved status', () => {
      service.validate(mockBoard).subscribe((response) => {
        expect(response.status).toBe('solved');
      });

      const req = httpMock.expectOne('https://sugoku.onrender.com/validate');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');
      req.flush({ status: 'solved' });
    });

    it('should return broken status for invalid board', () => {
      service.validate(mockBoard).subscribe((response) => {
        expect(response.status).toBe('broken');
      });

      const req = httpMock.expectOne('https://sugoku.onrender.com/validate');
      req.flush({ status: 'broken' });
    });
  });

  describe('solve', () => {
    it('should post board and return solution', () => {
      const solvedBoard: ApiBoard = mockBoard.map(row => row.map(cell => cell || 1));

      service.solve(mockBoard).subscribe((response) => {
        expect(response.status).toBe('solved');
        expect(response.solution).toEqual(solvedBoard);
      });

      const req = httpMock.expectOne('https://sugoku.onrender.com/solve');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');
      req.flush({ status: 'solved', solution: solvedBoard, difficulty: 'easy' });
    });

    it('should return unsolvable status for broken board', () => {
      service.solve(mockBoard).subscribe((response) => {
        expect(response.status).toBe('unsolvable');
      });

      const req = httpMock.expectOne('https://sugoku.onrender.com/solve');
      req.flush({ status: 'unsolvable' });
    });
  });
});
