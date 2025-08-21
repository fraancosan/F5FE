import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Users } from '../services/db/users';
import { inject } from '@angular/core';
import { LocalStorage } from '../services/common/local-storage';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageSv = inject(LocalStorage);
  const userSv = inject(Users);

  const token = localStorageSv.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        userSv.signOut(true);
      }
      return throwError(() => error);
    })
  );
};
