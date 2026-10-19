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

Jeder Ordner enthält eine `Aufgabe.md` (Aufgabe, Lernziele, Lösungshinweise und einen **Zeitrichtwert**) und das Projekt `invoice-app` im **Stand nach der Lösung**. Die nächste Übung startet im Ordner der vorigen Übung. Ordner 24 gibt es nicht, Übung 24 steckt in `23_communication`.

**So werden die Ordner im Kurs genutzt:**
- Die Teilnehmenden bearbeiten die Übung im Projekt der **vorigen** Übung (Startpunkt) und vergleichen bei Bedarf mit dem Lösungsordner der aktuellen Übung.
- Wer eine Übung nicht schafft oder einen Tag verpasst hat, startet die nächste Übung trotzdem sauber im Lösungsordner der vorigen. Kein Teilnehmender bleibt dadurch auf einem fehlerhaften Zwischenstand sitzen.
- Zeitrichtwerte sind **Schätzungen** für eine Gruppe mit Grundkenntnissen und noch nicht in einem Kurs erprobt. Bei Gruppen ohne Vorkenntnisse oder mit Dolmetschen sollte etwa die Hälfte mehr eingeplant werden.

**TypeScript**

| Ordner | Übung | Richtwert |
|---|---|---|
| `00_typescript_guess_a_number` | Übung 0: Zahlenraten (TypeScript im Browser) | 30 Minuten |
| `01_simple_class` | Übung 1: Die Klasse Student | 10 Minuten |
| `02_constructor` | Übung 2: Ein Konstruktor für Student | 10 Minuten |
| `03_modules` | Übung 3: Module | 15 Minuten |

**Grundlagen (Grundkurs, Tag 1–3)**

| Ordner | Übung | Richtwert |
|---|---|---|
| `04_initial_project` | Übung 4: Erstelle das initiale Projekt | 15 Minuten |
| `05_initial_project` | Übung 5: Erstelle ein eigenes Datenmodell (Databinding) | 20 Minuten |
| `06_directives` | Übung 6: Zeige eine Liste aller Customer an | 15 Minuten |
| `07_subcomponents` | Übung 7: Komponenten schachteln | 20 Minuten |
| `08_input` | Übung 8: Inputs | 15 Minuten |
| `09_clickEvent` | Übung 9: Events | 10 Minuten |
| `10_outputEvent` | Übung 10: Output | 15 Minuten |
| `11_image` | Übung 11: Bindings auf Images und mehr | 15 Minuten |
| `12_selected` | Übung 12: Class Binding | 10 Minuten |
| `13_templateForms` | Übung 13: Formulare | 15 Minuten |
| `14_service` | Übung 14: Erstelle einen CustomerService | 20 Minuten |
| `15_dependencyInjection` | Übung 15: Injiziere den CustomerService | 10 Minuten |
| `16_lifecycle` | Übung 16: OnInit | 10 Minuten |
| `17_datePipe` | Übung 17: Pipe | 10 Minuten |
| `18_customPipe` | Übung 18: Schreibe eine eigene Pipe | 15 Minuten |
| `19_observables` | Übung 19: Async CustomerService | 20 Minuten |
| `20_router` | Übung 20: Routen für Listenansicht | 15 Minuten |
| `21_dynamic_routes` | Übung 21: Routing mit Parametern | 20 Minuten |
| `22_forms` | Übung 22: Kunde bearbeiten (Template-Driven Form) | 30 Minuten |
| `23_communication` | Übung 23 & 24: Speichern über den Service und Anbindung ans Backend | 45 Minuten (Teil 1: 20, Teil 2: 25) |

**Aufbau: Auth, Resource API, Komponenten (Tag 4)**

| Ordner | Übung | Richtwert |
|---|---|---|
| `25_httpInterceptorGuard` | Übung 25: Funktionale Guards & Interceptors | 30 Minuten |
| `26_resourceApi` | Übung 26: Resource API (httpResource / rxResource) | 25 Minuten |
| `27_ngOptimizedImage` | Übung 27: NgOptimizedImage | 15 Minuten |
| `28_viewChild` | Übung 28: viewChild() | 15 Minuten |
| `29_contentProjection` | Übung 29: Content Projection (<ng-content>) | 20 Minuten |

**Legacy**

| Ordner | Übung | Richtwert |
|---|---|---|
| `30_modules_legacy` | Übung 30: Legacy – Angular Module (NgModule) | 30 Minuten |

**Neue Kapitel (Kompaktkurs, Tag 4–5)**

| Ordner | Übung | Richtwert |
|---|---|---|
| `31_komponenten_aufteilen` | Übung 31: Kundenliste in Komponenten aufteilen | 30 Minuten |
| `32_reaktivitaet` | Übung 32: Reaktivitäts-Fallen finden | 45 Minuten |
| `33_state_store` | Übung 33: CustomerStore einführen | 45 Minuten |
| `34_tests` | Übung 34: Tests schreiben und bewerten | 45 Minuten |
| `35_performance` | Übung 35: „Langsame Liste“ | 45 Minuten |
| `36_sicherheit` | Übung 36: XSS erleben und beheben | 40 Minuten |
| `37_ki_review` | Übung 37: KI-Ergebnis reviewen | 30 Minuten |
| `38_abschluss` | Übung 38: Abschlussprojekt „Kunden-Dashboard“ | 60 Minuten (Gruppenarbeit) |

**Wahlthema**

| Ordner | Übung | Richtwert |
|---|---|---|
| `Z1_reactive_forms` | Wahlübung Z1: Reactive Forms mit FormBuilder und Validierung | 30 Minuten |

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
