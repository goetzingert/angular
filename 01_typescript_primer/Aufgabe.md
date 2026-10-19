# TypeScript-Primer: Übungen 1–5

**Zeitrichtwert:** ca. 70 Minuten insgesamt (Übung 1: 10, Übung 2: 15, Übung 3: 15, Übung 4: 20, Übung 5: 10)

Fünf kurze Übungen, die jeweils direkt nach dem passenden Block des TypeScript Primers gemacht werden. Alle Beispiele nutzen die Kunden-Domäne der Invoice-App. Die letzte Übung führt direkt zur Klasse `Customer`, die du in Übung 5 des Angular-Kurses (`customer.model.ts`) wieder brauchst.

## Vorbereitung (einmalig)

```bash
cd 01_typescript_primer
npm install
```

## Arbeitsweise

| Befehl | Wirkung |
|---|---|
| `npm run check` | Prüft **alle Typen** in `src/` und meldet Fehler (nichts wird ausgeführt) |
| `npm run watch` | Wie `check`, prüft bei jeder Änderung automatisch neu |
| `npm start -- src/uebung-2-funktionen.ts` | Führt eine Datei aus |
| `npm run check:loesung` | Prüft die Typen der Musterlösungen |
| `npm run pruefe-loesungen` | Führt alle Musterlösungen aus und vergleicht die Ausgabe mit `*.expected.txt` |

**Wichtig:** `npm start` führt TypeScript aus, **ohne** die Typen zu prüfen. Fehler zeigen dir der Editor (rote Wellenlinien) und `npm run check`. Beide gehören zu deiner Arbeit.

Die Aufgaben liegen in `src/`, die Musterlösungen in `loesung/`. Jede Datei ist ein eigenes Modul (`export {};` am Ende), damit sich Namen zwischen den Übungen nicht stören.

---

## Übung 1: Typfehler beheben (ca. 10 Minuten)

Datei: `src/uebung-1-typfehler.ts`. Das Programm enthält absichtlich 6 Fehler.

1. Führe `npm run check` aus und lies die 6 Fehlermeldungen.
2. Behebe jeden Fehler, ohne `any` zu benutzen. Manche Fehler behebst du im Code, bei anderen musst du den **Typ** anpassen (z. B. „kein Wert“ in den Typ aufnehmen).
3. Führe das Programm aus: `npm start -- src/uebung-1-typfehler.ts`.

**Lernziele:** Du kannst Compilerfehler lesen, `const` und `let` richtig einsetzen, `undefined` im Typ ausdrücken und `?.` und `??` verwenden.

*Lösungshinweise:* `string | undefined` ist ein Union-Typ. `customer.city?.toUpperCase() ?? "UNBEKANNT"` greift nur zu, wenn `city` einen Wert hat. Musterlösung: `loesung/uebung-1-typfehler.ts`.

## Übung 2: Funktionen typisieren (ca. 15 Minuten)

Datei: `src/uebung-2-funktionen.ts`. Vier Funktionen sind als Gerüst vorgegeben (`fullName`, `filterCustomers`, `cityOf`, `joinNames`).

1. Schreibe `fullName` und `filterCustomers` (Tipp: `filter`, `includes`, `toLowerCase`).
2. Schreibe `cityOf` mit einem **Standardwert** für den zweiten Parameter.
3. Schreibe `joinNames` mit einem **Rest-Parameter** (`...customers`) und `map` und `join`.
4. Bis du Aufgabe 3 und 4 gelöst hast, meldet `npm run check` zwei Fehler. Das ist gewollt.

**Lernziele:** Du kannst Parameter und Rückgabewerte typisieren, Standardwerte und Rest-Parameter einsetzen und Listen mit `filter` und `map` verarbeiten.

*Lösungshinweise:* Eine Arrow-Funktion als Argument: `customers.filter(c => c.firstname ...)`. Musterlösung: `loesung/uebung-2-funktionen.ts`.

## Übung 3: Objekte und Listen, ohne sie zu verändern (ca. 15 Minuten)

Datei: `src/uebung-3-objekte.ts`.

1. `renameCustomer`: gibt eine **neue** Liste zurück, in der ein Kunde den neuen Vornamen hat (Tipp: `map` und `{ ...c, firstname }`).
2. `addCustomer`: gibt eine **neue** Liste mit einem Kunden mehr zurück (Tipp: `[...customers, customer]`).
3. `describe`: zerlegt den Parameter direkt in der Signatur (**Destructuring**), gibt `city` einen Standardwert und baut den Text mit einem **Template-String**.
4. Prüfe in der Ausgabe, dass die ursprüngliche Liste unverändert geblieben ist.

**Lernziele:** Du kannst Spread (`...`) für Kopien nutzen, Objekte zerlegen und Template-Strings schreiben. Du verstehst, warum Angular (Signals) neue Objekte statt Veränderungen erwartet.

*Lösungshinweise:* Spread kopiert **flach**. `push` und direktes Ändern (`c.firstname = ...`) verändern das Original, das ist hier verboten. Musterlösung: `loesung/uebung-3-objekte.ts`.

## Übung 4: Die Klasse Customer (ca. 20 Minuten)

Datei: `src/uebung-4-klassen.ts`.

1. Schreibe die Klasse `Customer` mit „Parameter properties“ (`public firstname: string` im Konstruktor), einer `id` aus `crypto.randomUUID()`, einem Getter `fullName` und der Methode `getLabel()`.
2. Die Klasse implementiert das Interface `Labelled`.
3. Schreibe `VipCustomer extends Customer` mit dem Zusatzattribut `discount` und ergänze in `getLabel()` den Text der Oberklasse (`super.getLabel()`).
4. Entferne die Kommentarzeichen am Ende der Datei und führe sie aus.

**Lernziele:** Du kannst eine Klasse mit Konstruktor, Getter und Methoden schreiben, ein Interface implementieren und mit `extends` und `super` erben. Genau diese Schreibweise (Parameter properties) begegnet dir in Angular wieder.

*Lösungshinweise:* Bei einer Unterklasse mit eigenem Konstruktor muss `super(...)` **zuerst** aufgerufen werden. `override` markiert eine überschriebene Methode. Musterlösung: `loesung/uebung-4-klassen.ts`.

## Übung 5: Module (ca. 10 Minuten)

Datei: `src/uebung-5-module.ts`.

1. Lege `src/customer.ts` an, verschiebe die Klasse `Customer` und das Interface `Labelled` dorthin und exportiere beides (`export`).
2. Importiere in `src/uebung-5-module.ts`: `import { Customer } from "./customer";`
3. Führe die Datei aus.

**Lernziele:** Du kannst Klassen mit `export` bereitstellen und mit `import` nutzen. Jede Angular-Komponente importiert auf diese Weise, was sie braucht.

*Lösungshinweise:* Der Pfad beginnt mit `./` für Dateien im selben Ordner und hat keine Dateiendung. Typen lassen sich mit `import { type Labelled }` importieren. Musterlösung: `loesung/uebung-5-module/`.
