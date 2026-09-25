# Übung 16: OnInit

## Aufgabe

Initialisiere die Daten in `AppComponent` im `ngOnInit`-Hook statt im Konstruktor.

1. Implementiere das Interface `OnInit` aus `@angular/core` in `AppComponent`.
2. Verschiebe das Laden der Daten (den Aufruf von `customerService.getAll()`) aus dem Konstruktor in die Hook-Methode `ngOnInit`.
3. Entferne den nun leeren Konstruktor bzw. lasse ihn ganz weg.

## Lernziele

- Du kennst den Unterschied zwischen dem Konstruktor einer Klasse und dem `ngOnInit`-Lifecycle-Hook von Angular.
- Du verstehst, warum Angular empfiehlt, komplexere Initialisierungslogik (z. B. Daten laden) in `ngOnInit` statt in den Konstruktor zu legen.
- Du weißt, dass `ngOnInit` erst aufgerufen wird, nachdem Angular alle Inputs der Komponente gesetzt hat – der Konstruktor dagegen läuft schon vorher.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Die Klasse muss zusätzlich `implements OnInit` deklarieren, damit TypeScript prüft, dass die Methode `ngOnInit(): void { ... }` korrekt vorhanden ist.
- `OnInit` muss aus `@angular/core` importiert werden.
- Der `inject()`-Aufruf für den Service bleibt weiterhin als Feld-Initialisierung stehen – nur der eigentliche Datenaufruf wandert in `ngOnInit`.
