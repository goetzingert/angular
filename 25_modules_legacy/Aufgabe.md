# Übung 25: Legacy – Angular Module (NgModule)

## Aufgabe

Lerne den klassischen, Modul-basierten Aufbau einer Angular-Anwendung kennen, wie er in vielen Bestandsprojekten noch verwendet wird.

1. Öffne das Projekt `25_modules_legacy` (NgModule-basierte Variante).
2. Starte das Backend (`server`-Ordner: `npm install`, dann `node server.js`).
3. Starte die App mit `ng serve --proxy-config dev.proxy.json`.
4. Analysiere den Aufbau: `main.ts` mit `platformBrowserDynamic().bootstrapModule(AppModule)`, die `AppModule`-Klasse mit `declarations`, `imports`, `providers` und `bootstrap`, sowie das zugehörige `AppRoutingModule` mit `RouterModule.forRoot(...)`.
5. Erzeuge per `ng generate component ... --standalone=false` eine eigene, klassisch deklarierte Komponente und trage sie in ein Modul ein.
6. Binde zusätzlich eine bestehende Standalone-Komponente über `imports: []` in ein NgModule ein (Mischbetrieb).
7. Optional: Führe `ng generate @angular/core:standalone` aus und vergleiche das Ergebnis mit `23_communication`.

## Lernziele

- Du verstehst den klassischen NgModule-Aufbau (`declarations`, `imports`, `exports`, `providers`, `bootstrap`) und wie er sich vom Standalone-Ansatz unterscheidet.
- Du weißt, dass neue Module NICHT automatisch im übergeordneten Modul registriert werden – das muss man selbst erledigen.
- Du hast gesehen, dass Standalone-Komponenten und NgModules gemischt in einem Projekt eingesetzt werden können (wichtig für schrittweise Migrationen in echten Projekten).

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Für eine klassisch deklarierte Komponente musst du sie im `declarations`-Array eines Moduls eintragen, nicht im `imports`-Array einer Standalone-Komponente.
- Eine Standalone-Komponente lässt sich direkt im `imports`-Array eines `@NgModule` verwenden – das ist bewusst so gestaltet, um Migrationen zu erleichtern.
- Der automatische Migrationsbefehl `ng generate @angular/core:standalone` läuft in mehreren Schritten (Komponenten, dann Bootstrapping) – lies dir vor dem Ausführen kurz die Beschreibung der einzelnen Migrations-Schritte durch.
