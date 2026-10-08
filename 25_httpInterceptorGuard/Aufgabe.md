# Übung 25: Funktionale Guards & Interceptors

## Aufgabe

Schütze die Kundenrouten mit einem Login und protokolliere alle HTTP-Aufrufe.

1. Erstelle einen `AuthService`, der einen einfachen Login-Status als Signal verwaltet (`isLoggedIn()`, `login()`, `logout()`).
2. Erstelle einen funktionalen Route Guard `authGuard` (`CanActivateFn`), der per `inject()` auf `AuthService` und `Router` zugreift. Ist der Nutzer nicht eingeloggt, soll zur Login-Seite weitergeleitet werden.
3. Hänge den Guard über `canActivate: [authGuard]` an die Routen `customer` und `customer/:id` in `app.routes.ts`.
4. Erstelle eine einfache `LoginComponent` mit einem Button, der `authService.login()` aufruft und danach zur Kundenliste navigiert.
5. Erstelle einen funktionalen HTTP-Interceptor `loggingInterceptor` (`HttpInterceptorFn`), der Start, Erfolg und Fehler jedes HTTP-Aufrufs in der Konsole protokolliert.
6. Registriere den Interceptor in `main.ts` über `provideHttpClient(withInterceptors([loggingInterceptor]))`.

## Lernziele

- Du kannst einen funktionalen Route Guard schreiben, ohne eine Klasse mit `CanActivate`-Interface zu implementieren.
- Du weißt, dass `inject()` auch außerhalb von Klassen (z. B. in einer einfachen Funktion) funktioniert, solange der Aufruf im Injection-Context passiert.
- Du kannst einen funktionalen HTTP-Interceptor schreiben und über `withInterceptors()` registrieren, statt eine `HttpInterceptor`-Klasse zu implementieren.
- Du verstehst den Vorteil der funktionalen APIs: weniger Boilerplate, einfachere Kombination mehrerer Guards/Interceptors als Array.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Ein funktionaler Guard hat die Signatur `export const authGuard: CanActivateFn = () => { ... }` und wird in den Routen als `canActivate: [authGuard]` (ohne Klammern, keine Instanz!) eingetragen.
- Für die Weiterleitung im Guard reicht `inject(Router).navigate(['/login'])`, gefolgt von `return false;`.
- Ein funktionaler Interceptor hat die Signatur `(req, next) => next(req)` und wird über `provideHttpClient(withInterceptors([loggingInterceptor]))` in `main.ts` registriert – nicht mehr über `HTTP_INTERCEPTORS` im Modul.
- Mit `next(req).pipe(tap({ next: ..., error: ... }))` lassen sich sowohl erfolgreiche als auch fehlgeschlagene Requests protokollieren, ohne den Response-Stream zu verändern.
- Diese Übung baut auf `23_communication` auf (inkl. Backend-Anbindung); der Login-Status ist nur eine reine Frontend-Simulation, es findet kein echter Server-seitiger Auth-Check statt.
