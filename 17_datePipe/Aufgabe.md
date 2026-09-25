# Übung 17: Pipe

## Aufgabe

Erweitere das Datenmodell und stelle ein Datum formatiert im Template dar.

1. Lege in `Customer` ein Feld / Konstruktor-Parameter `lastOrderDate` vom Typ `Date` an.
2. Passe die Mock-Daten an: Setze für jeden Customer ein unterschiedliches Datum (z. B. `new Date(year, month - 1, day)`).
3. Achte darauf, dass mindestens ein Customer ein Datum weniger als eine Woche in der Vergangenheit hat.
4. Erweitere das Template von `CustomerDetailsComponent` und gib `lastOrderDate` formatiert aus.
5. Probiere dabei verschiedene Formatierungen der eingebauten `DatePipe` aus (z. B. Pattern oder Shortcuts wie `'mediumDate'`, `'shortDate'`, `'dd.MM.yyyy'`).

## Lernziele

- Du kennst das Konzept von Pipes zur Transformation von Werten direkt im Template.
- Du kannst die eingebaute `DatePipe` aus `@angular/common` verwenden, um ein `Date`-Objekt lesbar darzustellen.
- Du weißt, dass eine Pipe (wie `DatePipe`) in Standalone-Komponenten explizit im `imports`-Array ergänzt werden muss.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Die Pipe-Syntax im Template lautet `{{ ausdruck | pipeName:parameter }}`, z. B. `{{ customer()?.lastOrderDate | date:'mediumDate' }}`.
- `DatePipe` muss aus `@angular/common` importiert und im `imports`-Array der Standalone-Komponente ergänzt werden.
- Eine Übersicht der verfügbaren Datumsformate findest du in der offiziellen Angular-Dokumentation zu `DatePipe`.
