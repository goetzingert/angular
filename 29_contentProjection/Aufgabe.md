# Übung 29: Content Projection (<ng-content>)

## Aufgabe

Erstelle eine wiederverwendbare Card-Komponente (`CardComponent`), die Inhalte von außen über `<ng-content>` aufnimmt und strukturiert darstellt.

1. Erstelle eine Standalone-Komponente `CardComponent` im Ordner `src/app/shared/card/`.
2. Definiere im Template der Card drei Bereiche über Multi-Slot Content Projection:
   - `<ng-content select="[card-header]"></ng-content>` für den Kopfbereich.
   - `<ng-content></ng-content>` (Default-Slot) für den Hauptinhalt.
   - `<ng-content select="[card-footer]"></ng-content>` für Aktionsbuttons im Fußbereich.
3. Gib der Card ein ansprechendes Styling mit Rahmen, Schatten und getrennten Bereichen für Header, Body und Footer.
4. Binde `CardComponent` in `CustomerDetailsComponent` ein und platziere das Formular sowie die Buttons in die entsprechenden Slots.

## Lernziele

- Du verstehst das Konzept der Content Projection (Komponenten-Komposition) in Angular.
- Du kannst einfache und Multi-Slot Content Projection mit `<ng-content select="...">` umsetzen.
- Du weißt, wie Child-Inhalte im Scope der Elternkomponente gerendert und an die Kindkomponente durchgereicht werden.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Der CSS-Attribut-Selektor `select="[card-header]"` matched auf jedes HTML-Element mit dem Attribut `card-header` (z. B. `<span card-header>...</span>` oder `<h3 card-header>...</h3>`).
- Der Slot ohne `select`-Attribut (`<ng-content></ng-content>`) fängt alle Inhalte auf, die zu keinem anderen Selektor passen.
- Vergiss nicht, `CardComponent` im `imports`-Array von `CustomerDetailsComponent` zu deklarieren.
