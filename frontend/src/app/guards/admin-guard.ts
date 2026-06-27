import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {

  // inyectamos AuthService para comprobar el rol
  const authService = inject(AuthService);

  // router para redirigir página
  const router = inject(Router);

  // usuario admin?
  if (authService.isAdmin()) {
    // dejamos pasar
    return true;
  }

  // redirige a items
  router.navigate(['items']);

  // bloquea ruta
  return false;
  
};
