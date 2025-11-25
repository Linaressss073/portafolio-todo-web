import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snack = inject(MatSnackBar);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        (error.error && (error.error.message || error.error.code)) ||
        error.statusText ||
        'Error inesperado';
      snack.open(message, 'Cerrar', { duration: 4000, panelClass: 'error-snackbar' });
      return throwError(() => error);
    })
  );
};
