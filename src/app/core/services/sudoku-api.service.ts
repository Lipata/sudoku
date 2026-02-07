import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BoardResponse, Difficulty } from '../../models';

@Injectable({ providedIn: 'root' })
export class SudokuApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://sugoku.onrender.com';

  getBoard(difficulty: Difficulty): Observable<BoardResponse> {
    return this.http.get<BoardResponse>(`${this.baseUrl}/board`, {
      params: { difficulty },
    });
  }
}
