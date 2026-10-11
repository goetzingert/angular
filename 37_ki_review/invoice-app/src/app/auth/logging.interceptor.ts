import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

// Funktionaler Interceptor: einfache Funktion statt einer Klasse mit HttpInterceptor-Interface.
// Wird über provideHttpClient(withInterceptors([...])) registriert.
//
// Sicherheit: Es werden nur Methode, URL, Status und Dauer protokolliert. Header (z. B. Authorization),
// Request-Body und Antwort-Body gehören NICHT ins Log, denn dort stehen Tokens und personenbezogene Daten.
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();
  console.log(`[HTTP] ${req.method} ${req.url} gestartet`);

  return next(req).pipe(
    tap({
      next: () => console.log(`[HTTP] ${req.method} ${req.url} erfolgreich (${Date.now() - started}ms)`),
      error: (error: HttpErrorResponse) =>
        console.log(`[HTTP] ${req.method} ${req.url} fehlgeschlagen (Status ${error.status}, ${Date.now() - started}ms)`)
    })
  );
};
