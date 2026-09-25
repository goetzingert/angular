# Übung 22: Formulare mit FormBuilder und Validierung

## Aufgabe

Biete in der Detail-Ansicht die Möglichkeit, Kundendaten über ein Formular zu bearbeiten und zu validieren.

1. Importiere `ReactiveFormsModule` im `imports`-Array von `CustomerDetailsComponent`.
2. Implementiere in `CustomerDetailsComponent` ein typisiertes Formular mit `FormGroup` und `FormControl` (z. B. für Vorname, Nachname, PLZ).
3. Validiere: Vor- und Nachname sind Pflichtfelder (`Validators.required`), die PLZ darf nur aus Ziffern bestehen (`Validators.pattern(...)`).
4. Gib für jedes ungültige Feld eine passende Fehlermeldung im Template aus.
5. Verhindere das Absenden des Formulars, solange es ungültig ist.

## Lernziele

- Du kannst ein typisiertes Reactive Form mit `FormGroup`/`FormControl` aufbauen.
- Du verstehst die verschiedenen Feld-Zustände (`touched`/`dirty`/`valid`/`errors`) und wie man sie fürs Anzeigen von Fehlermeldungen nutzt.
- Du weißt, warum Client- und Server-seitige Validierung sich ergänzen, statt sich zu ersetzen.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- `[formGroup]="form"` am `<form>`-Tag verbindet das Formular, `formControlName="feldname"` bzw. `[formControl]="form.controls.feldname"` verbindet die einzelnen Felder.
- Für eine Fehlermeldung reicht z. B. `@if (form.controls.plz.dirty && form.controls.plz.errors?.pattern) { ... }`.
- Das `(ngSubmit)`-Event am Formular ist der richtige Ort, um das eigentliche Absenden (und ggf. den Aufruf von `CustomerService.update(...)`) auszulösen.
