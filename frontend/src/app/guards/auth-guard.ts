import { inject } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // AuthService para comprobar login
  const authService = inject(AuthService);

  // Router para redirigir
  const router = inject(Router);

  // usuario autenticado?
  if (authService.isAuthenticated()) {
    // dejamos pasar
    return true;
  }

  // redirige a login
  router.navigate(['/login']);

  //bloquea la ruta
  return false;

};
