# Übung 8: Inputs

## Aufgabe

Erweitere `CustomerListComponent`, damit sie die Kundendaten von außen entgegennimmt statt sie selbst zu halten.

1. Nimm in `CustomerListComponent` einen Input entgegen, der ein Array von `Customer`-Objekten enthält (z. B. per `customers = input<Customer[]>([])`).
2. Verschiebe die bisherige, fest hinterlegte Kundenliste von `CustomerListComponent` zurück nach `AppComponent`.
3. Übergib die Liste per Property Binding an `CustomerListComponent`, z. B. `[customers]="customers"`.
4. Passe das Template von `CustomerListComponent` so an, dass es den Input statt einer eigenen Variable anzeigt (Signal-Inputs werden im Template als Funktion aufgerufen, z. B. `customers()`).

## Lernziele

- Du kannst eine Komponente Daten per Signal-Input entgegennehmen lassen.
- Du verstehst den Unterschied zwischen einer Komponente, die eigene Daten hält, und einer, die Daten von außen bekommt.
- Du weißt, wie man einen Input im Template korrekt ausliest (`inputName()` statt `inputName`).

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- `input<Customer[]>([])` legt einen Input mit einem leeren Array als Startwert an; alternativ ist `input.required<Customer[]>()` möglich, wenn der Input zwingend übergeben werden muss.
- Achte auf die runden Klammern beim Lesen eines Signal-Inputs im Template – ein häufiger Anfängerfehler ist, sie zu vergessen.
- Die Property-Binding-Syntax im Elternteil lautet `[customers]="deineVariable"`, mit eckigen Klammern um den Attributnamen.
