import { HttpInterceptorFn } from '@angular/common/http';

const API_KEY = 'YOUR_API_KEY';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    setHeaders: { 'x-api-key': API_KEY },
  });
  return next(authReq);
};
