import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // AuthService para obtener token
  const authService = inject(AuthService);

  // pedimos token actual guardado, leer token
  const token = authService.getToken();

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
  return next(clonedRequest);
  
};
