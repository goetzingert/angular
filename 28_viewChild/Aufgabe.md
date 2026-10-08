# Übung 28: viewChild()

## Aufgabe

Ergänze in `CustomerListComponent` ein Filterfeld und greife per `viewChild()` direkt auf das native Input-Element zu.

1. Füge im Template ein `<input>`-Feld mit einer Template-Referenzvariable (z. B. `#searchInput`) hinzu, über das der Kundenname gefiltert werden kann.
2. Deklariere in der Komponente `searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');`.
3. Implementiere eine Methode `filteredCustomers()`, die die Kundenliste anhand des eingegebenen Textes filtert (z. B. per `Array.filter`).
4. Implementiere eine Methode `clearFilter()`, die den Filtertext zurücksetzt und über `this.searchInput()?.nativeElement.focus()` den Fokus wieder auf das Eingabefeld setzt.
5. Verwende im Template statt `customers()` nun `filteredCustomers()` für die `@for`-Schleife.

## Lernziele

- Du kennst die signal-basierte Alternative `viewChild()` zum klassischen `@ViewChild()`-Dekorator.
- Du weißt, dass `viewChild()` ein Signal zurückgibt, das erst nach der ersten Change-Detection-Runde einen Wert hat (davor `undefined`).
- Du kannst über eine Template-Referenzvariable (`#name`) gezielt auf ein natives DOM-Element im eigenen Template zugreifen.
- Du verstehst den Unterschied zwischen `viewChild()` (Elemente im eigenen Template) und `contentChild()` (per Content Projection eingefügte Elemente, siehe Übung 29).

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Der String `'searchInput'` in `viewChild<ElementRef<HTMLInputElement>>('searchInput')` muss exakt dem Namen der Template-Referenzvariable (`#searchInput`) entsprechen.
- `viewChild()` ist standardmäßig optional (Rückgabewert `Signal<T | undefined>`). Für Pflichtfelder gibt es `viewChild.required(...)`.
- Da `viewChild()` ein Signal ist, kannst du es wie jedes andere Signal auslesen: `this.searchInput()` statt `this.searchInput`.
- Achte darauf, `ElementRef` aus `@angular/core` zu importieren.
