import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.user();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // Permitir acceso a usuarios con rol Writer o Admin
  const allowedRoles = ['writer', 'admin'];
  const hasAccess = user.roles.some((role) => allowedRoles.includes(role.toLowerCase()));

  if (!hasAccess) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
