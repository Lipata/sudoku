import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();
  console.log(`[HTTP] ${req.method} ${req.url}`);

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const elapsed = Date.now() - started;
        console.log(`[HTTP] ${req.method} ${req.url} → ${event.status} (${elapsed}ms)`);
      }
    }),
    catchError(error => {
      const elapsed = Date.now() - started;
      console.error(`[HTTP] ${req.method} ${req.url} → ${error.status} (${elapsed}ms)`, error.message);
      return throwError(() => error);
    }),
  );
};
