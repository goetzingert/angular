# Übung 1: Die Klasse Student

**Zeitrichtwert:** ca. 10 Minuten

## Aufgabe

Erstelle die Klasse `Student` (Datei `student.ts`), sodass dieser Code funktioniert:

```ts
let s: Student = new Student();
let label: string = s.getLabel(123456);
console.log(label);   // "Student mit Matrikelnummer: 123456"
```

1. Lege die Klasse mit der Methode `getLabel` an. Sie bekommt die Matrikelnummer als Parameter vom Typ `number` und liefert einen Text (`string`) zurück.
2. Kompiliere mit `npx tsc` und starte das Ergebnis mit `node student.js`.

## Lernziele

- Du kannst eine Klasse mit einer Methode, typisierten Parametern und Rückgabetyp schreiben.
- Du kannst TypeScript kompilieren und das erzeugte JavaScript mit Node.js ausführen.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Syntax einer Methode: `getLabel(studentNumber: number): string { ... }`.
- Texte lassen sich mit `+` zusammensetzen; eine Zahl wird dabei automatisch in Text umgewandelt.
- Die Musterlösung steht in `student.ts` (und das erzeugte `student.js`).
