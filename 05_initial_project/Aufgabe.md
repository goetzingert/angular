# Übung 5: Erstelle ein eigenes Datenmodell (Databinding)

## Aufgabe

Lege dein erstes eigenes Datenmodell an, das später als Basis für die Kundenliste der App dient.

1. Lege eine neue Datei `src/app/customer/customer.model.ts` an.
2. Erstelle darin eine Klasse `Customer` und exportiere sie.
3. Gib der Klasse mindestens die Eigenschaften `id`, `firstname` und `lastname` (du kannst später jederzeit weitere Felder ergänzen, z. B. `city`).
4. Erzeuge in `AppComponent` mindestens ein Objekt dieses Typs und zeige einzelne Eigenschaften per Interpolation (`{{ }}`) im Template an.

## Lernziele

- Du kannst ein eigenes, typisiertes Datenmodell in TypeScript definieren und exportieren.
- Du verstehst, wie Klassen-Eigenschaften der Komponente per Interpolation im Template angezeigt werden (Data Binding).
- Du siehst den Unterschied zwischen `export`-versehenen und rein lokalen Deklarationen.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Ein einfacher Konstruktor mit den benötigten Parametern erleichtert das spätere Anlegen von Testdaten sehr.
- Achte darauf, `export class Customer { ... }` zu schreiben – ohne `export` wäre die Klasse nur innerhalb dieser Datei nutzbar.
- Für die Anzeige reicht zunächst ganz normales `{{ customer.firstname }}` im HTML-Template.
