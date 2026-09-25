# Übung 9: Events

## Aufgabe

Reagiere in `CustomerListComponent` auf Klicks auf die einzelnen Listen-Elemente.

1. Ergänze im Template von `CustomerListComponent` ein Event Binding auf das Klick-Event jedes Listenelements, z. B. `(click)="listItemClicked($event, customer)"`.
2. Implementiere in der Komponenten-Klasse eine passende Methode `listItemClicked(event, customer)`.
3. Gib zur Kontrolle in dieser Methode zunächst einfach den angeklickten Kunden auf der Konsole aus (`console.log(...)`).

## Lernziele

- Du kannst mit Event Binding auf Browser-Events wie Klicks reagieren.
- Du verstehst, dass beliebige Methoden mit selbst gewählten Parametern als Event-Handler genutzt werden können (nicht nur ein festes Event-Objekt).
- Du weißt, wie man über `$event` an das eigentliche Browser-Event-Objekt kommt, falls benötigt.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Die Klammern-Syntax `(click)="..."` ist rund, nicht eckig – eckige Klammern `[...]` sind für Property Binding (Daten nach innen), runde `(...)` für Event Binding (Daten/Events nach außen bzw. Reaktionen).
- Du kannst der aufgerufenen Methode beliebige zusätzliche Parameter übergeben, z. B. direkt den aktuellen Kunden aus der Schleifenvariable.
- Diese Übung bereitet die nächste Übung (Output) vor, in der der Klick nach außen an `AppComponent` weitergemeldet wird.
