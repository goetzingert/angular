# Übung 0: Zahlenraten (TypeScript im Browser)

**Zeitrichtwert:** ca. 30 Minuten

Eine Zusatzübung zum TypeScript Primer. Der Ordner enthält die fertige Lösung; die Teilnehmenden bauen das Spiel selbst nach oder ergänzen die Zusatzaufgabe.

## Aufgabe

Baue ein kleines Ratespiel: Das Programm denkt sich eine Zahl zwischen 0 und 100 aus, der Benutzer rät.

1. Erzeuge beim Start eine Zufallszahl (`Math.floor(Math.random() * 100)`).
2. Hole die Elemente `numberInput`, `hint` und `check` aus der Seite (`document.getElementById`) und gib ihnen die passenden Typen (`HTMLInputElement`, `HTMLElement`, `HTMLButtonElement`).
3. Lies beim Klick auf „Ist Zahl?“ die Eingabe als Zahl und gib in `hint` aus, ob sie zu klein, zu groß oder richtig ist. Bei einer leeren oder ungültigen Eingabe soll „Keine Zahl eingegeben“ erscheinen.
4. Zusatzaufgabe: Der Button „Neue Zahl“ erzeugt eine neue Zufallszahl und leert den Hinweis.
5. Kompiliere mit `npx tsc` und öffne `index.html` im Browser.

## Lernziele

- Du kannst TypeScript mit dem Compiler `tsc` in JavaScript übersetzen und im Browser ausführen.
- Du kannst DOM-Elemente mit Typen versehen und weißt, wofür `as` (Typ-Zusicherung) gebraucht wird.
- Du erkennst, dass `tsc` Typfehler schon beim Übersetzen meldet, nicht erst im Browser.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- `document.getElementById(...)` liefert `HTMLElement | null`. Mit `as HTMLInputElement` sagst du dem Compiler, welcher konkrete Typ gemeint ist.
- `numberInput.valueAsNumber` liefert eine Zahl; bei leerem Feld ist sie `NaN` (prüfbar mit `isNaN`).
- Die Datei `app.js` wird von `tsc` aus `app.ts` erzeugt und mit eingecheckt, damit die Übung auch ohne Compiler im Browser läuft. Wer `app.ts` ändert, muss neu kompilieren.
