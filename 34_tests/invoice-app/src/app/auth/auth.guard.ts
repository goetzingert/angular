import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Funktionaler Guard: einfache Funktion statt einer Klasse mit CanActivate-Interface.
// inject() funktioniert auch außerhalb von Klassen/Constructor.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
