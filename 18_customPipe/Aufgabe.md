# Übung 18: Schreibe eine eigene Pipe

## Aufgabe

Erstelle eine eigene Pipe, die aus der Kundenliste nur aktive Kunden filtert.

1. Generiere eine Pipe per `ng generate pipe customer/current-active-customers-pipe`.
2. Implementiere in der erzeugten Klasse die `transform`-Methode aus dem Interface `PipeTransform`.
3. Die Methode soll aus einem übergebenen Array von `Customer`-Objekten nur die noch aktiven (also nicht `discontinued`) Kunden zurückgeben.
4. Nutze die neue Pipe im Template, um nur aktive Kunden anzuzeigen.

## Lernziele

- Du kannst eine eigene Pipe erzeugen und das Interface `PipeTransform` implementieren.
- Du verstehst, dass Pipes reine, wiederverwendbare Transformationsbausteine für die UI-Darstellung sind.
- Du weißt, wie eine selbst geschriebene Pipe (ebenso wie eine eingebaute) im `imports`-Array einer Standalone-Komponente eingebunden wird.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Die `transform`-Methode bekommt als ersten Parameter den Wert vor dem Pipe-Symbol übergeben (hier das gesamte Kundenarray) und muss den transformierten Wert zurückgeben.
- Ein einfacher `.filter(...)`-Aufruf auf dem übergebenen Array reicht für die Kernlogik aus.
- Denke daran, die Pipe-Klasse (nicht nur ihren Namen im Template) im `imports`-Array der jeweiligen Komponente zu ergänzen.
