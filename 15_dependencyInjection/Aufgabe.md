# Übung 15: Injiziere den CustomerService

## Aufgabe

Nutze den zuvor erstellten `CustomerService` tatsächlich in `AppComponent`.

1. Stelle sicher, dass `CustomerService` über `@Injectable({ providedIn: 'root' })` zur Verfügung steht (das ist bereits der Standard von `ng generate service`).
2. Lasse `CustomerService` in `AppComponent` injizieren, z. B. per `private readonly customerService = inject(CustomerService);`.
3. Ersetze die bisher fest in `AppComponent` hinterlegten Kundendaten durch einen Aufruf der entsprechenden Service-Methode.

## Lernziele

- Du kannst einen Service per `inject()` in eine Komponente injizieren.
- Du verstehst das Prinzip von Dependency Injection: Abhängigkeiten werden von außen bereitgestellt, statt selbst erzeugt zu werden.
- Du siehst den praktischen Vorteil: Die Komponente muss nicht wissen, woher die Daten wirklich kommen.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- `inject()` wird direkt als Feld-Initialisierung geschrieben, nicht im Konstruktor-Rumpf.
- Achte darauf, den Import von `inject` aus `@angular/core` nicht zu vergessen.
- Wenn du eine Fehlermeldung zu einem fehlenden Provider bekommst, prüfe, ob `CustomerService` wirklich mit `providedIn: 'root'` versehen ist.
