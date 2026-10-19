# Übung 2: Ein Konstruktor für Student

**Zeitrichtwert:** ca. 10 Minuten

Baut auf Übung 1 (`01_simple_class`) auf.

## Aufgabe

Erweitere die Klasse `Student` um einen Konstruktor, sodass dieser Code funktioniert:

```ts
let s: Student = new Student("Max", 123456);
let label: string = s.getLabel();
console.log(label);   // "Student Max mit Matrikelnummer: 123456"
```

1. Füge einen Konstruktor mit Name (`string`) und Matrikelnummer (`number`) hinzu.
2. `getLabel()` braucht jetzt keinen Parameter mehr und setzt beide Werte in den Text ein.
3. Kompiliere mit `npx tsc` und starte mit `node student.js`.

## Lernziele

- Du kannst einen Konstruktor schreiben und Attribute beim Erzeugen eines Objekts setzen.
- Du kennst die Abkürzung „Parameter properties“: `constructor(private name: string)` deklariert und setzt das Attribut in einem Schritt. Das Muster begegnet dir später in Angular wieder.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Ohne Abkürzung: Attribute oben in der Klasse deklarieren und im Konstruktor mit `this.name = name;` setzen.
- Mit `private` sind die Attribute von außen nicht lesbar. `s.name` würde einen Compilerfehler ergeben, probiere es aus.
