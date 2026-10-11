# Übung 31: Kundenliste in Komponenten aufteilen

**Zeitrichtwert:** ca. 30 Minuten

Basis: Ergebnis von Übung 29 (`29_contentProjection`). Das Verhalten der App darf sich durch die Übung **nicht** ändern.

## Aufgabe

Zerlege `CustomerListComponent` in eine Container-Komponente und zwei Darstellungskomponenten.

1. Erzeuge `CustomerFilterComponent` (Eingabefeld und Button „Filter leeren & fokussieren“). Schnittstelle: `value = input('')`, `changed = output<string>()`, `cleared = output<void>()`. Der Fokus-Mechanismus mit `viewChild()` wandert mit in die neue Komponente.
2. Erzeuge `CustomerListItemComponent` für eine Zeile der Liste mit `customer = input.required<Customer>()`, `selected = input(false)` und `chosen = output<Customer>()`. Die Stile für „durchgestrichen“ (`discontinued`) und „markiert“ (`selected`) wandern mit.
3. `CustomerListComponent` behält nur drei Aufgaben: Daten laden, Filterzustand halten, Auswahlzustand halten.
4. Prüfe im Browser (Smoke-Test): Liste lädt, Filtern funktioniert, „Filter leeren & fokussieren“ setzt den Fokus, Klick markiert eine Zeile, Klick auf den Namen öffnet die Details. Auch `ng build` und `ng test` müssen weiter grün sein.
5. Reflexion (5 Minuten): Welche Komponente ist jetzt trivial testbar? Welche Abhängigkeiten sind verschwunden?

## Lernziele

- Du wendest die Aufteilungskriterien an („Ein Satz ohne und“, Wiederverwendung, unterschiedliche Änderungsgründe).
- Du definierst saubere, typisierte Schnittstellen mit `input()`, `input.required()` und `output()`.
- Du trennst Container (Daten und Zustand) von Darstellung (Anzeigen und Ereignisse weitergeben).

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Der `track`-Ausdruck in `@for` bleibt vorerst unverändert (Thema in Kapitel 5).
- `routerLink` darf in `CustomerListItemComponent` bleiben, denn es ist reine Darstellung und Navigation.
- Damit im Elternteil weiterhin ein gültiges `<ul><li>` entsteht, kann die Zeilenkomponente einen Attribut-Selektor auf `li` verwenden (`selector: 'li[customer-list-item]'`). Im Container steht dann `<li customer-list-item [customer]="customer" ...></li>`.
- Klassen am Host-Element (`discontinued`, `selected`) und den Klick setzt du am einfachsten über `host: { ... }` im Decorator. In der Komponenten-CSS spricht man das Host-Element mit `:host(.selected)` an.
- Ein Pflicht-Input (`input.required`) muss in Tests vor dem ersten Rendern gesetzt werden: `fixture.componentRef.setInput('customer', ...)`.
- `CustomerListComponent` braucht `ElementRef`, `viewChild` und `RouterLink` nicht mehr.
