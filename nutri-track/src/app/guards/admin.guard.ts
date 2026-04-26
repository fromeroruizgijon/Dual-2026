import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Protege rutas que solo puede ver un administrador
export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  if (token && isAdmin) {
    return true;
  }
  router.navigate(['/']);
  return false;
};
