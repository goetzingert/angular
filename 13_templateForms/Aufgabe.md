# Übung 13: Formulare

## Aufgabe

Biete in der Detail-Ansicht die Möglichkeit an, den Namen eines Customers zu verändern.

1. Importiere `FormsModule` aus `@angular/forms` im `imports`-Array von `CustomerDetailsComponent`.
2. Erstelle ein `<input>`-Feld mit `ngModel`, das an den Vornamen des ausgewählten Kunden gebunden ist.
3. Teste im Browser, dass Änderungen am Eingabefeld den angezeigten Vornamen (bzw. das Objekt) tatsächlich aktualisieren.

## Lernziele

- Du kennst den Unterschied zwischen Template-Driven Forms (`FormsModule`/`ngModel`) und Reactive Forms.
- Du kannst mit `[(ngModel)]` eine Zwei-Wege-Bindung zwischen einem Formularfeld und einer Eigenschaft herstellen.
- Du verstehst, dass `ngModel` innerhalb eines `<form>`-Elements (oder mit `ngModelOptions: {standalone: true}`) verwendet werden muss.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- `FormsModule` muss im `imports`-Array der Standalone-Komponente ergänzt werden, sonst kennt Angular die Direktive `ngModel` nicht.
- Da `customer` hier ein Signal-Input ist, kannst du trotzdem einzelne Eigenschaften des zurückgegebenen Objekts verändern (z. B. `customer()!.firstname`) – nur das Signal selbst darf die Komponente nicht neu setzen.
- Ein `<input>` mit `ngModel` braucht entweder ein umschließendes `<form>`-Element oder ein `name`-Attribut zusammen mit `[ngModelOptions]="{standalone: true}"`.
