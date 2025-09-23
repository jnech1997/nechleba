// auth-error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // Clear invalid token
        localStorage.removeItem('authToken');
        // Redirect to login
        router.navigate(['/projects/sandbox/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => error);
    })
  );
};