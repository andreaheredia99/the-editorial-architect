import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // AuthService para obtener token
  const authService = inject(AuthService);

  // pedimos token actual guardado, leer token
  const token = authService.getToken();

  // Router para redirigir
  const router = inject(Router);
  
  // ToastService para notificaciones
  const toastService = inject(ToastService);

  // si no hay token (request normal)
  if (!token) {
    return next(req);
  }

  // creamos copia request modificada y añadimos headers HTTP Authorization
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  // enviamos request modificada al backend
  return next(clonedRequest).pipe( // .pipe, cuando vuelva la respuesta, dejame revisarla
    catchError((error) => {
      // error 401 logOut
      if (error.status === 401) {
        authService.logOut();
        toastService.show('Session expired. Please login again.', 'error');
        router.navigate(['/login']);
      }
      // devuelve error a Angular
      return throwError(() => error);
    })
  );
  
}
