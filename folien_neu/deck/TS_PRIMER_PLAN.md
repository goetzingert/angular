# Neuer TypeScript Primer: Plan für die Folieninhalte

Der TypeScript Primer (Originalfolien 1–69 von `presentation_angular21.pptx`) wird neu aufgebaut. **Stehen bleiben** die Originalfolien 1 (Titel), 7 („TypeScript is just JavaScript“), 8 (Diagramm ECMAScript 5 + 6 + Features = TypeScript) und 9 („Warum TypeScript“, vier Kacheln). **Gelöscht** werden die Originalfolien 2–6 und 10–69 (das macht `content_tsprimer_00_ops.json`). Alle neuen Folien werden **nach Originalfolie 9** eingefügt (`"after": 9`).

Format und Sprechtext-Stil: siehe `SCHEMA.md` (lesen!). Die Sprechtexte sind für eine Gebärdensprachdolmetscherin und sehr wichtig: ganze, einfache Sätze, Fachbegriffe in „…“ erklärt, Code sinngemäß beschreiben, keine Ironie. Bestehende Notizen der alten TypeScript-Folien (im aktuellen Deck die Folien 11–79) dürfen als Grundlage für Erklärungen dienen, sind aber teils fehlerhaft: Fachaussagen prüfen.

## Leitlinien
- **Domäne durchgängig `Customer`** (Kunden-Verwaltung der Invoice-App). Keine Schweine, Fahrzeuge, Studenten.
- **Moderner Stil:** `const`/`let`, Arrow-Funktionen, kein `var` (außer auf der Folie „Warum nicht mehr var“), strikter Modus (`strict`), Zielversion ES2022.
- Jede Folie eine Idee. Code: höchstens 18 Zeilen und 90 Zeichen pro Zeile. Aufzählungen: höchstens 9 Zeilen und 95 Zeichen. Keine Tabellen, keine Emojis.
- **Jedes Code-Beispiel wird mit dem Compiler geprüft** (siehe unten, `_verify`). Erfundene APIs sind nicht erlaubt.
- Brücken zum restlichen Kurs ausdrücklich nennen (in Sprechtext oder Aufzählung), z. B.: Spread ↔ „Mutation statt neuer Referenz“ bei Signals (Kapitel Reaktivität), Generics ↔ `signal<T>()` und `input<T>()`, Parameter properties ↔ Konstruktor-Injection, Dekoratoren ↔ `@Component`.
- Die Mikro-Übungen (`TS-Übung 1…5`) liegen fertig im Ordner `01_typescript_primer/` (Aufgaben in `src/`, Musterlösungen in `loesung/`, Beschreibung in `Aufgabe.md`). **Lies `01_typescript_primer/Aufgabe.md` und die Dateien in `src/`**, die Übungsfolien müssen dazu passen (gleiche Aufgaben, gleiche Dateinamen).

## Kanonische Kunden-Definition (überall gleich verwenden)
```ts
interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  city?: string;
  discontinued?: boolean;
  lastOrderDate?: Date;
}
const customers: Customer[] = [
  { id: "1", firstname: "Lisa", lastname: "Simpson", city: "Springfield" },
  { id: "2", firstname: "Hans", lastname: "Maulwurf", city: "Springfield", discontinued: true },
  { id: "3", firstname: "Ned", lastname: "Flanders" },
];
```
Die Klasse (ab dem Block „Klassen“) entspricht dem echten Modell der Invoice-App (`customer.model.ts`): `class Customer { id; constructor(public firstname: string, public lastname: string, public street?: string, public zip?: string, public city?: string, …) { this.id = crypto.randomUUID(); } }`.

## Prüfung der Code-Beispiele (`_verify`, `_prelude`)
Jede Folie mit `"type": "code"` kann zusätzlich haben:
- `"_verify": "ok"` (Standard): Code muss im strikten Modus ohne Fehler übersetzen. `"error:TS2322"`: das Beispiel **zeigt absichtlich** diesen Fehler. `"skip"`: keine Prüfung (nur für Konsolenausgaben, JSON, Befehle).
- `"_prelude"`: Code, der vor dem Beispiel eingefügt wird (nicht sichtbar), z. B. `interface Customer` und die Liste `customers`, damit das Beispiel kurz bleiben kann.

Prüfen mit: `python3 -I folien_neu/deck/verify_ts_snippets.py folien_neu/deck/<deine Datei>.json` (benötigt `npm install` in `01_typescript_primer`; falls `node_modules` fehlt, dort `npm install --no-audit --no-fund` ausführen). Alle Beispiele müssen bestehen. Die Felder mit `_` werden von `build_deck.py` ignoriert.

## Bauen und ansehen
Original holen: `git show baf0614:presentation_angular21.pptx > <scratch>/original.pptx`. Zum Testen deine Datei **zusammen mit** `content_tsprimer_00_ops.json` in ein eigenes Verzeichnis kopieren und bauen:
`python3 -I folien_neu/deck/build_deck.py <scratch>/original.pptx <scratch>/test.pptx --content-dir <verz>`. Die Ausgabe darf keine Warnungen zu zu langen Inhalten oder fehlenden Notizen enthalten (Code darf bei kleinen Schriftverkleinerungen warnen, aber nicht über 16 Zeilen). Rendern (`soffice --headless --convert-to pdf`, `pdftoppm`) und einige Folien ansehen ist erwünscht.

## Folien-Liste (Titel exakt so verwenden; Typ in Klammern)

Aufteilung auf drei Dateien. `order` bestimmt die Reihenfolge nach Originalfolie 9; jede Datei hat **einen Block pro Abschnitt** (`"after": 9`, `"order": <Zahl>`).

### Datei 1: `content_tsprimer_a_c.json` (Abschnitte A–C, orders 10, 20, 30)
**A – Einstieg (order 10)**
1. „Vom Quelltext zum Browser“ (content): .ts → Compiler (`tsc`) → .js; Browser und Node.js verstehen nur JavaScript; Typen verschwinden beim Übersetzen; die Angular CLI übernimmt das für uns; Typprüfung ist nicht Ausführen.
2. „Der Kursordner und die Befehle“ (content): Ordner `01_typescript_primer`, `npm install`; `npm run check`, `npm run watch`, `npm start -- src/<datei>.ts`; wichtig: `npm start` führt aus **ohne** Typen zu prüfen, Fehler zeigen Editor und `npm run check`.
3. „tsconfig.json der Invoice-App“ (code, `_verify: skip`): die wichtigen Optionen aus `38_abschluss/invoice-app/tsconfig.json` (`strict`, `noImplicitReturns`, `target: ES2022`, `experimentalDecorators`, `strictTemplates`); im Sprechtext erklären, was `strict` bedeutet.
4. „Ein erster Typfehler“ (code, `_verify: error:TS2345`): Funktion mit typisierten Parametern wird mit falschem Typ aufgerufen (z. B. mit Customer-Bezug).

**B – Typen (order 20)**
5. „Typen“ (divider)
6. „Typen und Typableitung“ (code): Basistypen `string`, `number`, `boolean`, `Date`, Arrays; explizit vs. Inference; Hinweis: Typ weglassen, wenn der Wert ihn klar macht.
7. „const und let“ (code): `const` ist Standard, `let` nur wenn sich der Wert ändert; `const` bei Objekten/Listen: Inhalt änderbar, Variable nicht neu zuweisbar.
8. „Warum nicht mehr var“ (code, hier ist `var` erlaubt): das `setTimeout`-Beispiel mit `var` vs. `let` (gibt 10× 10 vs. 0..9); eine Folie reicht, `_verify: ok`.
9. „any, unknown und never“ (code): `any` schaltet die Prüfung ab (vermeiden); `unknown` zwingt zur Prüfung (`typeof`); `never` (Funktion, die nie zurückkehrt).
10. „null und undefined im strikten Modus“ (code): `string | undefined`, Fehler beim Zugriff ohne Prüfung (`_verify: error:TS18048` oder passender Code, Compiler fragen), Prüfung mit `if`.
11. „Sicher mit fehlenden Werten: ?., ?? und !“ (code): optional chaining, nullish coalescing, Non-null-Assertion `!` (Warnung: nur wenn sicher). Bezug: Der Kurs benutzt `customer()?.firstname` und `customer()!.imageUrl!`.
12. „TS-Übung 1: Typfehler beheben“ (exercise)

**C – Funktionen (order 30)**
13. „Funktionen“ (divider)
14. „Funktionen typisieren“ (code): Parameter- und Rückgabetypen, optionaler Parameter `?`, Standardwert.
15. „Rest-Parameter und Arrow-Funktionen“ (code): `...nums`, `(a, b) => a + b`, Callback als Argument.
16. „Listen verarbeiten: filter, map, find“ (code): mit `customers`.
17. „TS-Übung 2: Funktionen typisieren“ (exercise)

### Datei 2: `content_tsprimer_d_e.json` (Abschnitte D–E, orders 40, 50)
**D – Objekte und Listen (order 40)**
18. „Objekte und Listen“ (divider)
19. „Interfaces: die Form eines Objekts“ (code): `interface Customer` (kanonisch), Objekt erfüllt Interface, Fehler bei fehlender Pflicht-Eigenschaft (eigene Folie nicht nötig, im Sprechtext).
20. „Optional und readonly“ (code).
21. „Destructuring“ (code): Objekte und Listen zerlegen, in Parametern, Standardwerte.
22. „Spread: kopieren statt verändern“ (code): `{ ...customer, firstname }`, `[...list, x]`, flache Kopie; Bezug zu Angular/Signals (Mutation statt neuer Referenz, Kapitel Reaktivität).
23. „Template-Strings“ (code).
24. „TS-Übung 3: Objekte und Listen“ (exercise)

**E – Typen kombinieren (order 50)**
25. „Typen kombinieren“ (divider)
26. „Union Types und Narrowing“ (code): `string | number`, `typeof`, `in`, Unterscheidung über ein Feld (diskriminierte Union, z. B. `{ status: "loading" } | { status: "loaded"; data: Customer[] }`, Bezug zum Zustands-Kapitel).
27. „Literal-Typen und type“ (code): `type Status = "active" | "discontinued"`; `type`-Alias; Hinweis: enum gibt es, Literal-Typen sind meist einfacher.
28. „interface oder type?“ (content): Gemeinsamkeiten, Unterschiede, Faustregel für den Kurs (Objekt-Formen: `interface`; Unions/Aliase: `type`).
29. „Generics“ (code): `Array<T>`, `Promise<T>`, eigene Funktion `first<T>(items: T[]): T | undefined`; Bezug zu `signal<T>()`, `input<T>()`, `Observable<T>`.
30. „Hilfstypen: Partial, Pick, Omit“ (code): kurz, mit Customer (z. B. `Partial<Customer>` für Änderungen).

### Datei 3: `content_tsprimer_f_g.json` (Abschnitte F–G, orders 60, 70)
**F – Klassen (order 60)**
31. „Klassen“ (divider)
32. „Klassen: Attribute, Konstruktor, Methoden“ (code): Klasse `Customer` ausführlich (ohne Abkürzung).
33. „Parameter Properties“ (code): `constructor(public firstname: string, ...)`; Bezug: später `constructor(private service: X)` bzw. `inject()`; das echte `customer.model.ts`.
34. „Sichtbarkeit und readonly“ (code): `public`, `protected`, `private`, `readonly`; Fehler bei Zugriff auf `private` (`_verify: error:TS2341`).
35. „Getter und Setter“ (code): `get fullName()`, `set` mit Prüfung (richtige Syntax!).
36. „implements: ein Interface erfüllen“ (code): `interface Labelled`, `class Customer implements Labelled`.
37. „extends und super“ (code): `VipCustomer extends Customer`, `super(...)` zuerst, `override`.
38. „Dekoratoren: ein Blick auf Angular“ (code): Dekorator als Funktion, die eine Klasse beschreibt; eine einfache selbst definierte Dekorator-Funktion `@Component({ selector: "customer-list" })` (mit `_prelude` definiert, `experimentalDecorators` ist beim Prüfen gesetzt); erklären: In Angular ist `@Component` genau das, mit Template und Stil.
39. „TS-Übung 4: Die Klasse Customer“ (exercise)

**G – Module (order 70)**
40. „Module“ (divider)
41. „Module: export und import“ (code): zwei Dateien als zwei Kommentarblöcke im Code (`// customer.ts` und `// main.ts`); `_verify: skip` (Mehrdateien) oder Beispiele pro Datei einzeln prüfbar halten.
42. „Regeln für import und export“ (content): statisch (nicht in `if`), Pfad `./`, benannte Exporte vs. Standard-Export, `import type`.
43. „TS-Übung 5: Module“ (exercise)
44. „Von TypeScript zu Angular“ (code): eine winzige Komponentenklasse als Brücke (`@Component({...}) export class CustomerListComponent { customers: Customer[] = [] }`, `_verify: skip`, da `@angular/core` fehlt; im Sprechtext erklären, dass die Bausteine alle schon bekannt sind). Hinweis auf Übung 4 (Projekt anlegen).
45. „Zusammenfassung: Was wir für Angular mitnehmen“ (content): Checkliste der Primer-Themen und wo sie im Kurs wieder vorkommen.

## Übungsfolien (Typ `exercise`)
Titel „TS-Übung N: …“. Zeilen: erste Zeile `Öffne 01_typescript_primer, Datei src/<datei>.ts`, dann die Aufgaben nummeriert (aus `Aufgabe.md`, gekürzt auf höchstens 9 Zeilen), letzte Zeile `Musterlösung: loesung/<datei>.ts`. Sprechtext: „Folie: „TS-Übung N: …“.\n\nErklärung für die Dolmetscherin:\n…“, 3–6 Sätze.

## Sprechtext-Pflicht
Jede Folie (auch Divider) braucht `notes`. Divider: `Kapitelübergangsfolie „<Titel>“ – …` (1–3 Sätze, was kommt). Codefolien: `Codefolie „<Titel>“.` + Erklärung, was passiert und warum.
