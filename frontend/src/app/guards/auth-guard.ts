import { inject } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // obtenemos AuthService
  const authService = inject(AuthService);

  // obtenemos Router
  const router = inject(Router);

  // usuario autenticado?
  if (authService.isAuthenticated()) {
    // dejamos pasar
    return true;
  }
  // redirige a login
  router.navigate(['/login']);

  //bloquea acceso
  return false;

};
