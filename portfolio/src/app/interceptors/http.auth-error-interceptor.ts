// auth-error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const AuthErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // !req.url.includes('refresh') so that auth.refreshAccessToken
      // which hits refresh api endpoint doesn't cause an infinite error loop
      if ((error.status === 401 || error.status === 403) && !req.url.includes('/refresh')) {
        return auth.refreshAccessToken().pipe(
          switchMap((newToken) => {
            // Retry the original request with new token
            const cloned = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            });
            return next(cloned);
          }),
          catchError(() => {
            auth.logout();
            router.navigate(['/projects/sandbox/login'], { queryParams: { returnUrl: router.url } });
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};