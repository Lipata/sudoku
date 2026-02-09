import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiBoard, BoardResponse, Difficulty, SolveResponse, ValidateResponse } from '../../models';

@Injectable({ providedIn: 'root' })
export class SudokuApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://sugoku.onrender.com';

  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  });

  getBoard(difficulty: Difficulty): Observable<BoardResponse> {
    return this.http.get<BoardResponse>(`${this.baseUrl}/board`, {
      params: { difficulty },
    });
  }

  validate(board: ApiBoard): Observable<ValidateResponse> {
    return this.http.post<ValidateResponse>(
      `${this.baseUrl}/validate`,
      this.encodeBoard(board),
      { headers: this.headers }
    );
  }

  solve(board: ApiBoard): Observable<SolveResponse> {
    return this.http.post<SolveResponse>(
      `${this.baseUrl}/solve`,
      this.encodeBoard(board),
      { headers: this.headers }
    );
  }

  private encodeBoard(board: ApiBoard): string {
    return `board=${encodeURIComponent(JSON.stringify(board))}`;
  }
}
