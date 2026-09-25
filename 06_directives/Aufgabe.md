# Übung 6: Zeige eine Liste aller Customer an

## Aufgabe

Erweitere das Template von `AppComponent`, um eine Liste aller Customer-Objekte anzuzeigen.

1. Lege in `AppComponent` ein Array mehrerer `Customer`-Objekte an.
2. Nutze im Template den eingebauten Control-Flow-Block `@for`, um über dieses Array zu iterieren.
3. Zeige für jeden Kunden mindestens Vor- und Nachname in einem Listenelement (`<li>`) an.
4. Denke an den Pflicht-Ausdruck `track` in `@for` (z. B. `track customer.id`).

## Lernziele

- Du kannst mit `@for` über eine Liste von Objekten im Template iterieren.
- Du verstehst, wozu der `track`-Ausdruck bei `@for` dient.
- Du weißt, dass für `@for`/`@if` kein `CommonModule`-Import mehr nötig ist (anders als früher bei `*ngFor`).

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Die Grundsyntax lautet `@for (customer of customers; track customer.id) { ... }`.
- Für eine leere Liste kannst du optional einen `@empty { ... }`-Block ergänzen.
- Falls du eine Fehlermeldung zu einem fehlenden `track`-Ausdruck bekommst: Dieser ist bei `@for` im Unterschied zum alten `*ngFor` zwingend erforderlich.
