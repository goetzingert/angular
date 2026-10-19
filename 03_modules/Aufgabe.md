# Übung 3: Module

**Zeitrichtwert:** ca. 15 Minuten

Baut auf Übung 2 (`02_constructor`) auf.

## Aufgabe

Lagere die Klasse `Student` in ein Modul aus.

1. Erstelle die Datei `Student.ts` und verschiebe die Klasse dorthin. Exportiere sie mit `export`.
2. Importiere die Klasse in der ursprünglichen Datei (`test.ts`): `import {Student} from './Student';`
3. Kompiliere mit `npx tsc`. Das Projekt erzeugt AMD-Module (siehe `tsconfig.json`), die der Browser mit *RequireJS* lädt. Öffne dazu `module.html` und sieh in die Konsole des Browsers (Entwicklerwerkzeuge).

## Lernziele

- Du kannst Klassen mit `export` bereitstellen und mit `import` nutzen.
- Du weißt, dass jede Datei mit `import`/`export` ein eigenes Modul ist und Namen nur über `export` nach außen sichtbar werden.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Der Pfad im `import` beginnt mit `./` für Dateien im selben Ordner und hat keine Dateiendung.
- `module.html` lädt RequireJS aus dem Internet (cdnjs). Ohne Internetzugang bleibt die Seite leer, dann hilft ein Blick in `Student.js` und `test.js`.
- In Angular-Projekten ist die Modulsyntax `import`/`export` der Normalfall: Jede Komponente importiert, was sie braucht.
