import { inject } from '@angular/core';
import { Router, type CanActivateFn, type UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authzGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.Role();
  const expectedRoles = route.data['expectedRoles'] as Array<string>;

  if (expectedRoles.includes(role)) {
    return true;
  } else {
    return router.parseUrl('/page-not-found');
  }
};
