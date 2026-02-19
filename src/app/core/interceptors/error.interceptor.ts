import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';

const STATUS_MESSAGES: Record<number, string> = {
  0: 'Network error. Check your connection.',
  400: 'Invalid request.',
  404: 'Resource not found.',
  429: 'Too many requests. Try again later.',
  500: 'Server error. Try again later.',
  503: 'Service unavailable. Try again later.',
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError(error => {
      const message = STATUS_MESSAGES[error.status] ?? `Request failed (${error.status}).`;
      errorService.setError(message);
      return throwError(() => error);
    }),
  );
};
