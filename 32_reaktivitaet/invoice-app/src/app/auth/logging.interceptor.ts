import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

// Funktionaler Interceptor: einfache Funktion statt einer Klasse mit HttpInterceptor-Interface.
// Wird über provideHttpClient(withInterceptors([...])) registriert.
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();
  console.log(`[HTTP] ${req.method} ${req.url} gestartet`);

  return next(req).pipe(
    tap({
      next: () => console.log(`[HTTP] ${req.method} ${req.url} erfolgreich (${Date.now() - started}ms)`),
      error: (error) => console.log(`[HTTP] ${req.method} ${req.url} fehlgeschlagen (${Date.now() - started}ms)`, error)
    })
  );
};
