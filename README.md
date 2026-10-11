# Angular-Schulung (Angular 21)

Schulungsunterlagen und Übungsprojekte für den **Angular Kompaktkurs** (5 Tage) und den **Angular Grundkurs** (Tag 1–3) auf Basis von Angular 21 (standalone, zoneless, Signals).

[![CI](https://github.com/goetzingert/angular/actions/workflows/ci.yml/badge.svg)](https://github.com/goetzingert/angular/actions/workflows/ci.yml)

## Kursablauf

| Tag | Kurs | Inhalt |
|---|---|---|
| 1 | Grund- und Kompaktkurs | Einordnung, TypeScript, Projekt, Standalone, Templates, Data Binding, Control Flow |
| 2 | Grund- und Kompaktkurs | Komponenten (Input/Output), Signals, Services und DI, Lifecycle, Pipes |
| 3 | Grund- und Kompaktkurs | RxJS-Grundlagen, Routing, Template-Driven Form, HTTP-Anbindung (bis Übung 24) |
| 4 | nur Kompaktkurs | Guards und Interceptors, Resource API, Bilder, `viewChild`, Content Projection, Komponenten aufteilen, Reaktivität, Zustandsverwaltung |
| 5 | nur Kompaktkurs | Tests (Vitest), Performance, Sicherheit, KI-gestützte Entwicklung, Abschlussprojekt |

Der ausführliche Tagesplan mit Zeiten steht in [`Agenda_Vergleich_und_Verbesserungen.md`](Agenda_Vergleich_und_Verbesserungen.md) (Abschnitt 5).

## Unterlagen

| Datei | Inhalt |
|---|---|
| `presentation_angular21.pptx` / `.pdf` | Hauptpräsentation mit Sprechtexten für die Gebärdensprachdolmetscherin in den Notizen |
| `Testing_angular21.pptx` / `.pdf` | Testing mit Vitest (und Cypress), mit Sprechtexten |
| `State Management_angular21.pptx` / `.pdf` | NgRx |
| `Angular Material_angular21.pptx` / `.pdf` | Angular Material |
| `Glossar.md` / `Glossar.pdf` | Glossar Tag 1–5 |
| `folien_neu/` | Textentwürfe der neuen Kapitel, Übungskette, Werkzeuge zum Einbau in die Decks (`folien_neu/deck/`) |

## Übungsprojekte

Jeder Ordner enthält eine `Aufgabe.md` (Aufgabe, Lernziele, Lösungshinweise) und das Projekt `invoice-app` im **Stand nach der Lösung**. Die nächste Übung startet im Ordner der vorigen Übung. Ordner 24 gibt es nicht, Übung 24 steckt in `23_communication`.

**TypeScript**

| Ordner | Übung |
|---|---|
| `00_typescript_guess_a_number` | TypeScript-Übung (siehe Folien) |
| `01_simple_class` | TypeScript-Übung (siehe Folien) |
| `02_constructor` | TypeScript-Übung (siehe Folien) |
| `03_modules` | TypeScript-Übung (siehe Folien) |

**Grundlagen (Grundkurs, Tag 1–3)**

| Ordner | Übung |
|---|---|
| `04_initial_project` | Übung 4: Erstelle das initiale Projekt |
| `05_initial_project` | Übung 5: Erstelle ein eigenes Datenmodell (Databinding) |
| `06_directives` | Übung 6: Zeige eine Liste aller Customer an |
| `07_subcomponents` | Übung 7: Komponenten schachteln |
| `08_input` | Übung 8: Inputs |
| `09_clickEvent` | Übung 9: Events |
| `10_outputEvent` | Übung 10: Output |
| `11_image` | Übung 11: Bindings auf Images und mehr |
| `12_selected` | Übung 12: Class Binding |
| `13_templateForms` | Übung 13: Formulare |
| `14_service` | Übung 14: Erstelle einen CustomerService |
| `15_dependencyInjection` | Übung 15: Injiziere den CustomerService |
| `16_lifecycle` | Übung 16: OnInit |
| `17_datePipe` | Übung 17: Pipe |
| `18_customPipe` | Übung 18: Schreibe eine eigene Pipe |
| `19_observables` | Übung 19: Async CustomerService |
| `20_router` | Übung 20: Routen für Listenansicht |
| `21_dynamic_routes` | Übung 21: Routing mit Parametern |
| `22_forms` | Übung 22: Kunde bearbeiten (Template-Driven Form) |
| `23_communication` | Übung 23 & 24: Speichern über den Service und Anbindung ans Backend |

**Aufbau: Auth, Resource API, Komponenten (Tag 4)**

| Ordner | Übung |
|---|---|
| `25_httpInterceptorGuard` | Übung 25: Funktionale Guards & Interceptors |
| `26_resourceApi` | Übung 26: Resource API (httpResource / rxResource) |
| `27_ngOptimizedImage` | Übung 27: NgOptimizedImage |
| `28_viewChild` | Übung 28: viewChild() |
| `29_contentProjection` | Übung 29: Content Projection (<ng-content>) |

**Legacy**

| Ordner | Übung |
|---|---|
| `30_modules_legacy` | Übung 30: Legacy – Angular Module (NgModule) |

**Neue Kapitel (Kompaktkurs, Tag 4–5)**

| Ordner | Übung |
|---|---|
| `31_komponenten_aufteilen` | Übung 31: Kundenliste in Komponenten aufteilen |
| `32_reaktivitaet` | Übung 32: Reaktivitäts-Fallen finden |
| `33_state_store` | Übung 33: CustomerStore einführen |
| `34_tests` | Übung 34: Tests schreiben und bewerten |
| `35_performance` | Übung 35: „Langsame Liste“ |
| `36_sicherheit` | Übung 36: XSS erleben und beheben |
| `37_ki_review` | Übung 37: KI-Ergebnis reviewen |
| `38_abschluss` | Übung 38: Abschlussprojekt „Kunden-Dashboard“ |

**Wahlthema**

| Ordner | Übung |
|---|---|
| `Z1_reactive_forms` | Wahlübung Z1: Reactive Forms mit FormBuilder und Validierung |

### Voraussetzungen
- Node.js `^20.19`, `^22.12` oder `>=24` (Anforderung von Angular 21), npm
- Angular CLI wird über `npx ng` aus dem Projekt verwendet, eine globale Installation ist nicht nötig

### Eine Übung starten
```bash
cd 29_contentProjection/invoice-app
npm install
npm start            # ng serve (ab Übung 23 mit Backend, siehe unten)
```
Ab **Übung 23** nutzt die App das Backend. Dazu zuerst den Lehrserver starten:
```bash
cd server
npm install
node server.js       # läuft auf http://localhost:3000
```
und die App mit Proxy starten: `npx ng serve --proxy-config dev.proxy.json`.

### Tests
Alle Projekte nutzen **Vitest** (Umgebung `jsdom`, kein Browser nötig):
```bash
npm test                      # Watch-Modus
npx ng test --watch=false     # einmaliger Lauf
```

## Qualitätssicherung (CI)
Der Workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) baut und testet **jeden** Übungsordner (`ng build`, `ng test`) und prüft den Lehrserver (`npm audit`, Smoke-Test der REST-Schnittstelle). Neue Ordner mit `invoice-app/package.json` werden automatisch erkannt. Ändert man eine Übung, sollte der Lauf für alle Folgeübungen grün bleiben, da diese auf der vorherigen aufbauen.

## Hinweise
- `30_modules_legacy` ist eine eigene Basis (NgModule, `zone.js`) und baut nicht auf Übung 29 auf.
- `Z1_reactive_forms` ist ein Wahlthema (Reactive Forms) und baut auf dem Stand von Übung 21 auf.
- Die Decks können mit den Werkzeugen in `folien_neu/deck/` aus der Git-Historie neu aufgebaut werden (siehe dortige README).
