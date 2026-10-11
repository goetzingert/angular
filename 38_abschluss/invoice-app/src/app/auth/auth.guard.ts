import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Funktionaler Guard: einfache Funktion statt einer Klasse mit CanActivate-Interface.
// inject() funktioniert auch außerhalb von Klassen/Constructor.
//
// Hinweis zur Sicherheit: Ein Guard ist nur Komfort für die Oberfläche. Geschützt werden
// Daten erst durch das Backend, denn der Browser-Code lässt sich umgehen.
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Die ursprüngliche Adresse wird als returnUrl mitgegeben, damit man nach dem Login dorthin zurückkommt.
  // Wichtig: Dieser Wert kommt von außen (URL) und wird beim Login geprüft, siehe return-url.ts.
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
