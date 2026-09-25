# Übung 20: Routen für Listenansicht

## Aufgabe

Bereite die Anwendung auf Routing vor, um zwischen mehreren Ansichten navigieren zu können.

1. Erstelle eine Datei `src/app/app.routes.ts`.
2. Definiere und exportiere darin eine Konstante `routes` vom Typ `Routes` mit mindestens einer Route für die Kundenliste.
3. Registriere die Routen per `provideRouter(routes)` in den Providern von `bootstrapApplication` (main.ts).
4. Ergänze im Template ein `<router-outlet>`, an dessen Stelle die jeweils aktive Route angezeigt wird.

## Lernziele

- Du kannst eine grundlegende Routenkonfiguration in `app.routes.ts` erstellen und einbinden.
- Du verstehst, wie `provideRouter` den Router-Service für die gesamte Anwendung bereitstellt.
- Du weißt, wozu das `<router-outlet>`-Element im Template dient.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Eine Route besteht mindestens aus einem relativen `path` (ohne führenden Schrägstrich) und der anzuzeigenden `component`.
- `provideRouter(routes)` gehört ins `providers`-Array von `bootstrapApplication` in `main.ts`.
- Wenn beim Start nichts angezeigt wird, prüfe, ob im Template tatsächlich ein `<router-outlet>` vorhanden ist.
