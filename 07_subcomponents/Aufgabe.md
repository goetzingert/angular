# Übung 7: Komponenten schachteln

## Aufgabe

Lagere die Darstellung der Kundenliste in eine eigene, wiederverwendbare Komponente aus.

1. Erzeuge eine Komponente `CustomerListComponent`, generiert per `ng generate component customer/customer-list`.
2. Verschiebe die bisherige Listendarstellung (das `@for` über die Customer) aus `AppComponent` in diese neue Komponente.
3. Binde `CustomerListComponent` im Template von `AppComponent` ein (denke an den Eintrag im `imports`-Array der `@Component`-Annotation von `AppComponent`).

## Lernziele

- Du kannst per CLI eine neue Komponente erzeugen und ihre generierten Dateien einordnen.
- Du verstehst, wie Komponenten im Baum verschachtelt werden (Eltern-Kind-Beziehung).
- Du weißt, dass auch Komponenten wie Direktiven im `imports`-Array bekannt gemacht werden müssen.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Der CLI-Befehl legt automatisch Klasse, Template, Styling und Testdatei an – du musst nur noch den Inhalt verschieben.
- Vergiss nicht, den Import-Pfad und den Klassennamen von `CustomerListComponent` in `AppComponent` korrekt anzugeben.
- Zu diesem Zeitpunkt reicht es, wenn `CustomerListComponent` ihre Kundendaten noch selbst hält – die Übergabe von außen folgt erst in der nächsten Übung (Inputs).
