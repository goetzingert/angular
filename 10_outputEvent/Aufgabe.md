# Übung 10: Output

## Aufgabe

Melde den in `CustomerListComponent` angeklickten Kunden nach außen an `AppComponent`.

1. Erstelle in `CustomerListComponent` einen Output `customerSelected = output<Customer>()`.
2. Emittiere dieses Event in der Klick-Handler-Methode mit dem angeklickten Kunden (`this.customerSelected.emit(customer)`).
3. Fange dieses Event in `AppComponent` per Event Binding ab, z. B. `(customerSelected)="newCustomerSelected($event)"`.
4. Speichere den zuletzt ausgewählten Kunden in `AppComponent` in einem `signal<Customer | undefined>()`.

## Lernziele

- Du kannst mit `output<T>()` ein eigenes Event aus einer Komponente nach außen werfen.
- Du verstehst das Zusammenspiel: Input für Daten nach innen, Output für Events nach außen.
- Du kannst reaktiven, lokalen Zustand mit `signal()` und `.set()` in einer Komponente verwalten.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- `output<Customer>()` braucht keinen Startwert, im Gegensatz zu `input()`.
- Zum Auslösen des Events reicht `emit(wert)` – kein `new EventEmitter()` mehr nötig, das ist die ältere Schreibweise.
- Denke daran, das Signal im Template über einen Funktionsaufruf zu lesen, z. B. `{{ selectedCustomer()?.firstname }}`.
