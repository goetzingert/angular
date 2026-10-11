# Übung 22: Kunde bearbeiten (Template-Driven Form)

**Zeitrichtwert:** ca. 30 Minuten

## Aufgabe

Biete in der Detail-Ansicht die Möglichkeit, die Kundendaten in einem Formular zu bearbeiten und einfach zu validieren. Das Speichern über den Service folgt erst in Übung 23, hier geht es nur um Anzeige und Bearbeiten im Formular.

1. Importiere `FormsModule` im `imports`-Array von `CustomerDetailsComponent` (für das Datumsfeld zusätzlich `DatePipe` aus `@angular/common`).
2. Der geladene Kunde soll beim Tippen nicht verändert werden. Lege deshalb eine bearbeitbare Kopie als lokales Signal an, die bei jedem neu geladenen Kunden neu erzeugt wird: `draft = linkedSignal(() => ...)` mit einer Kopie `{ ...customer }`.
3. Baue im Template ein `<form>` mit den Feldern Vorname, Nachname, Straße, PLZ, Stadt und Datum der letzten Bestellung. Jedes Feld bekommt ein `name`-Attribut und eine Bindung per `[(ngModel)]` an die Kopie.
4. Validiere mit HTML-Attributen: Vor- und Nachname sind Pflichtfelder (`required`), die PLZ darf nur aus Ziffern bestehen (`pattern="[0-9]*"`).
5. Hole dir mit Template-Referenzen den Zustand der Felder (`#firstname="ngModel"`) und zeige Fehlermeldungen nur an, wenn das Feld ungültig ist **und** schon bearbeitet wurde: `@if (firstname.invalid && firstname.dirty) { ... }`.
6. Gib den Zustand des gesamten Formulars aus (`#customerForm="ngForm"`, z. B. `customerForm.valid`). Prüfe im Browser, dass sich das Formular bei leerem Vornamen oder einer PLZ mit Buchstaben als ungültig meldet und dass sich der Kunde in der Liste dabei nicht ändert.

## Lernziele

- Du kannst ein einfaches Template-Driven Form mit `FormsModule` und `ngModel` aufbauen.
- Du kannst Felder mit HTML-Attributen (`required`, `pattern`) validieren und den Zustand (`valid`, `invalid`, `dirty`) über Template-Referenzen auslesen.
- Du weißt, wofür `linkedSignal` gut ist: eine lokal veränderbare Kopie, die sich zurücksetzt, sobald sich ihre Quelle ändert.
- Du kennst den Unterschied zu Reactive Forms (Formular und Regeln im TypeScript-Code, `FormGroup`/`FormBuilder`). Diese Variante findest du als Wahlübung in `Z1_reactive_forms`.
- Du weißt, dass Client-Validierung die Validierung im Backend nicht ersetzt, sondern nur ergänzt.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- `ngModel` innerhalb eines `<form>` braucht zwingend ein `name`-Attribut, sonst wirft Angular einen Fehler.
- Mit `@if (draft(); as c) { ... }` bekommst du die Kopie unter dem Namen `c`, dann reicht im Template `[(ngModel)]="c.firstname"`. Das Schreiben in eine Eigenschaft von `c` ist erlaubt, nur `c` selbst lässt sich nicht zuweisen.
- Das Datumsfeld (`type="date"`) liefert einen String im Format `yyyy-MM-dd`, das Modell hält aber ein `Date`. Zerlege deshalb die Bindung: `[ngModel]="c.lastOrderDate | date:'yyyy-MM-dd':'UTC'"` und `(ngModelChange)="setLastOrderDate(c, $event)"`, wobei die Methode den String wieder in ein `Date` umwandelt.
- `linkedSignal(() => { const c = this.customer(); return c ? { ...c } : undefined; })` erzeugt die Kopie. Ändert sich `customer()`, wird das Formular auf den neuen Stand zurückgesetzt.
- `pattern="[0-9]*"` erlaubt auch eine leere PLZ. Wer eine Pflicht-PLZ möchte, ergänzt zusätzlich `required`.
