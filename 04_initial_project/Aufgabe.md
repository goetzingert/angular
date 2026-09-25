# Übung 4: Erstelle das initiale Projekt

## Aufgabe

Lege mit dem Angular CLI ein komplett neues Angular-Projekt an und bringe es zum Laufen.

1. Öffne ein Terminal.
2. Installiere, falls noch nicht geschehen, das Angular CLI global (`npm install -g @angular/cli`).
3. Navigiere zu einem passenden Ordner für deine Übungsprojekte.
4. Lege per `ng new <projektname>` ein neues Projekt an (Standalone-Komponenten sind der Standard, du musst nichts extra angeben).
5. Starte die Anwendung mit `ng serve -o` und prüfe, dass die Standard-Startseite unter `http://localhost:4200` erscheint.
6. Ändere zum Ausprobieren einmal den Seitentitel in `src/index.html` sowie die Willkommens-Nachricht in `src/app/app.component.html` und beobachte, dass der Browser automatisch aktualisiert.

## Lernziele

- Du kannst ein neues Angular-Projekt mit dem CLI anlegen und starten.
- Du kennst die Grundfunktion des Entwicklungsservers (`ng serve`) inklusive automatischem Neuladen bei Dateiänderungen.
- Du hast einen ersten Überblick über die von `ng new` erzeugte Projektstruktur.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Der Befehl `ng new` fragt dich interaktiv nach ein paar Grundeinstellungen (z. B. Routing, Stylesheet-Format) – für diese Übung kannst du überall die Standardwerte übernehmen.
- Wenn der Browser sich nach `ng serve -o` nicht automatisch öffnet, rufe `http://localhost:4200` manuell auf.
- Schau dir zur Orientierung `src/main.ts` an: Dort startet die Anwendung per `bootstrapApplication`, ganz ohne `NgModule`.
