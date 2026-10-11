# Übung 37: KI-Ergebnis reviewen

Basis: Ergebnis von Übung 36 (`36_sicherheit`). Du arbeitest wahlweise mit deinem eigenen KI-Werkzeug (sofern erlaubt) oder mit dem **vorbereiteten Beispielergebnis** in `material/ki-vorschlag.md`.

## Aufgabe

Auftrag an die KI (oder an das Material): „Ergänze eine Funktion ‚Kunden als CSV exportieren‘ und eine Komponente `CustomerExportButton`.“

1. Lies das Ergebnis und prüfe es mit der Review-Checkliste (Folie 7.5). Dokumentiere mindestens **fünf Befunde** (Stelle, Problem, verletzte Regel).
2. Im vorbereiteten Beispiel sind absichtlich Fehler enthalten, unter anderem `*ngIf`, `any`, ein `effect`, der ein Signal schreibt, ein `innerHTML` und ein Test mit `toBeTruthy`. Finde sie, und suche zusätzlich nach Fehlern, die nicht in dieser Liste stehen.
3. Spiele die Befunde in einem **zweiten Prompt** zurück („Behebe: …“, mit konkreten Stellen) und prüfe das Ergebnis erneut (Mehrrunden-Prozess).
4. Baue das korrigierte Feature in das Projekt ein: CSV-Funktion, `CustomerExportButtonComponent` in der Kundenliste, mit Tests. Probiere im Browser aus, dass der Download funktioniert.
5. Auswertung im Plenum: Welche Fehler hat die KI nicht selbst erkannt? Welche Fehler waren in der zweiten Runde neu?

## Lernziele

- Du bewertest Vorschläge einer KI kontrolliert, statt sie zu übernehmen („Es kompiliert“ heißt nicht „es ist richtig“).
- Du gibst Befunde konkret zurück und beurteilst das Ergebnis mehrerer Runden.
- Du erkennst typische Schwächen generierten Codes: veraltete Syntax, `any`, `effect` für abgeleiteten Zustand, Sicherheitsblindheit, Tests ohne Aussagekraft.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

Befunde im vorbereiteten Beispiel:

1. **`*ngIf` und `CommonModule`**: veraltete Syntax. Im Projekt gilt Control Flow (`@if`), `CommonModule` ist nicht nötig.
2. **`any`** bei `@Input() customers` und `exportCustomers(customers: any[])`: Das Modell `Customer` ist vorhanden. Richtig: `input.required<readonly Customer[]>()` und `readonly Customer[]`.
3. **`@Input()`-Dekorator** statt `input()`: Stilbruch zum Projekt (Signal-Inputs).
4. **`effect`, der ein Signal schreibt**: `count` und `message` sind abgeleitet beziehungsweise überflüssig. Dazu liest der `effect` einen Dekorator-Input, der kein Signal ist: Er läuft nie wieder, wenn sich der Input ändert. Besser: kein `effect`, die Anzahl direkt im Template oder als `computed`.
5. **`[innerHTML]` mit zusammengebautem String**: HTML aus Daten bauen ist das Muster für XSS (Kapitel 6). Reiner Text gehört in die Interpolation.
6. **Test mit `toBeTruthy`**: Der erste Test prüft nur, dass die Komponente existiert. Der zweite prüft nur, dass der Text nicht leer ist. Die Komponente selbst (Klick, Download) wird nicht getestet, kein Fehler- oder Randfall.
7. **CSV ist falsch**: Kein Escaping (Komma, Anführungszeichen, Zeilenumbruch im Wert zerstören die Datei). Fehlende Werte werden zum Text `undefined`, das Datum wird als `Date.toString()` ausgegeben. Werte, die mit `=`, `+`, `-` oder `@` beginnen, können in Excel als Formel ausgeführt werden (CSV-Injection).
8. **Download über `data:`-URL ohne Kodierung**: Ein `#` oder Zeilenumbruch im Inhalt schneidet oder bricht die Datei ab. Richtig: `Blob` und `URL.createObjectURL` (danach `revokeObjectURL`), mit BOM für Excel/Umlaute.
9. Kleinigkeiten: unbenutzter Import `Customer`, keine `OnPush`-Strategie wie in den anderen Komponenten, kein Hinweis für leere Listen.

Die Lösung in diesem Ordner:

- `customer/export/customer-csv.ts` mit `toCsv` und `escapeCsvField` (RFC-4180-Quoting, Formel-Schutz, ISO-Datum) und Tests.
- `customer/customer-export-button/` mit `input.required`, `@if`, `Blob`-Download, Button deaktiviert bei leerer Liste, Anzeige der Anzahl per Interpolation und Tests (Download-Inhalt, Dateiname, Anzeige).
- Verwendung in der Kundenliste: `<customer-export-button [customers]="store.filtered()" />`. Exportiert werden die aktuell gefilterten Kunden.
- Die Trennzeichen-Frage (Komma oder Semikolon, deutsches Excel erwartet oft `;`) ist eine Produktentscheidung; hier wird RFC 4180 mit Komma verwendet.
