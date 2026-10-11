# Kapitel 0 – Einordnung moderner Angular-Entwicklung

**Tag:** 1 (Einstieg, vor „Typescript Primer“) · **Dauer:** ca. 30–40 min · **Übung:** Abfrage am Anfang, Rückblick-Diskussion am Kursende, kein Code
**Agenda:** „Einordnung von Angular im aktuellen Frontend-Umfeld“ / „Architekturprinzipien und Positionierung im modernen Web-Stack“ / „Angular-Denkweise und zentrale Konzepte“

---

### Folie 0.1 – Wo steht Angular im Frontend-Umfeld?
- Frontend-Landschaft grob in drei Ebenen:
  - **UI-Bibliotheken:** React, Preact, Solid, Lit (nur Rendering – Rest wählt das Team)
  - **Frameworks:** Angular, Vue, Svelte (Rendering + mehr)
  - **Meta-Frameworks:** Next.js, Nuxt, SvelteKit, Analog (Routing, SSR, Build vorgegeben)
- Angular ist ein **vollständiges Framework**: Router, Formulare, HTTP, DI, Testing-Setup, CLI, i18n aus einer Hand.
- Konsequenz: weniger Auswahl- und Integrationsaufwand, dafür mehr Konvention.

> **Trainer:** Keine Vorkenntnisse voraussetzen (Gruppen sind klein, manche Teilnehmende kennen Angular noch gar nicht). Statt einer Diskussion eine kurze **Abfrage** (5 min): „Womit haben Sie bisher Weboberflächen gebaut (nichts / JavaScript / jQuery / React / Vue / Angular)? Was erwarten Sie vom Kurs?“ Bei Gruppen ohne Frontend-Erfahrung: Folie 0.1 als kurze Erklärung durch den Trainer, Vergleich mit anderen Technologien nur als Ausblick. Erwartungen notieren und am Kursende abgleichen.

### Folie 0.2 – „Batteries included“: Was Angular mitbringt
| Bedarf | Angular | Typisch bei Bibliotheken |
|---|---|---|
| Routing | `@angular/router` | React Router, TanStack Router |
| HTTP | `HttpClient` + Interceptors | fetch, axios |
| Formulare | Template-Driven, Reactive Forms | Formik, React Hook Form |
| Zustand | Signals, Services, NgRx | Redux, Zustand, MobX |
| Abhängigkeiten | Dependency Injection | Context, Module-Singletons |
| Tooling | Angular CLI (`ng`) | Vite, CRA, eigene Konfig |
| Tests | Vitest-Setup (ab v21), TestBed | Jest/Vitest + Testing Library |

### Folie 0.3 – Typische Einsatzgebiete (und Gegenindikationen)
- **Passt gut:** große, langlebige Unternehmensanwendungen, viele Teams, Dashboards, Formular-lastige Fachanwendungen, strenge Qualitätsanforderungen.
- **Passt weniger:** reine Content-Seiten/Blogs (Astro, statische Generatoren), sehr kleine Widgets, Teams ohne TypeScript-Erfahrung und ohne Zeit zum Einarbeiten.
- Entscheidungskriterien: Teamgröße, Lebensdauer, vorhandene Skills, Integrationsbedarf, Rendering-Anforderungen (SEO/SSR).

### Folie 0.4 – Architekturprinzipien von Angular
1. **Komponentenbasiert:** UI = Baum aus Komponenten (Template + Klasse + Stil).
2. **Dependency Injection:** Abhängigkeiten werden bereitgestellt, nicht selbst erzeugt → austauschbar, testbar.
3. **Einseitiger Datenfluss:** Daten fließen nach unten (`input`), Ereignisse nach oben (`output`).
4. **Starke Typisierung:** TypeScript `strict`, typisierte Templates, typisierte Formulare.
5. **Konvention vor Konfiguration:** gleiche Struktur in jedem Projekt → schnell einarbeiten.

### Folie 0.5 – Die Angular-Denkweise heute
> Weniger Boilerplate, mehr Reaktivität.

| Früher | Heute |
|---|---|
| `NgModule` | Standalone-Komponenten (`imports: []`) |
| Zone.js, implizite Change Detection | Signals, zoneless |
| `*ngIf`, `*ngFor` | `@if`, `@for`, `@switch` |
| `@Input()`, `@Output()`, `EventEmitter` | `input()`, `output()`, `model()` |
| Konstruktor-Injection | `inject()` |
| Klassen-Guards/-Interceptors | Funktionale Guards/Interceptors |
| Karma/Jasmine | Vitest |

> **Trainer:** Hinweis: Bestandsprojekte enthalten meist die linke Spalte. Das Material zeigt am Ende (Legacy-Kapitel) beide Welten.

### Folie 0.6 – Entwicklung in Etappen (grobe Orientierung)
- 2016 Angular 2 (Neuentwurf gegenüber AngularJS) → Ivy-Renderer (v9) → Standalone (ab v14/15) → Signals und Control Flow (v16/17) → zoneless (v20/21), Vitest als Standard-Testrunner (v21).
- **Release-Rhythmus:** zwei Major-Versionen pro Jahr, jede Version ca. 18 Monate unterstützt. Updates mit `ng update` und Migrations-Schematics.
- Folgerung: Wissen veraltet nicht schlagartig, aber Muster wandeln sich → Kurs vermittelt Prinzipien statt nur APIs.

> **Trainer:** Genaue Versionsnummern vor dem Kurs auf angular.dev gegenprüfen (Roadmap und Versionsübersicht).

### Folie 0.7 – Toolchain im Überblick
- **Angular CLI:** `ng new`, `ng serve`, `ng generate`, `ng build`, `ng test`, `ng update`.
- **Build:** esbuild/Vite-basierter Application Builder (schneller Dev-Server, HMR).
- **TypeScript** im strengen Modus, **ESLint**, **Prettier** als Teamstandard.
- Entwicklerwerkzeug: **Angular DevTools** im Browser (Komponentenbaum, Profiler).

### Folie 0.8 – Der rote Faden: die Invoice-App
- Alle Übungen entwickeln **eine** Anwendung weiter: Kundenverwaltung (Liste, Details, Login, Backend).
- Jede Übung startet vom Ergebnis der vorherigen Übung (Ordner `04_…` bis `38_…`).
- Struktur des Kurses:
  1. Grundlagen: Komponenten, Templates, Services, Routing
  2. Reaktivität und Datenfluss
  3. Anwendungsstruktur und Zustandsverwaltung
  4. Qualität, Tests, Wartbarkeit
  5. Performance, Sicherheit, KI-gestützte Entwicklung

### Folie 0.9 – Erwartungen und Vorerfahrung (5–10 min, Tag 1)
- Wer hat bisher Weboberflächen entwickelt, womit?
- Welche Anwendung soll nach dem Kurs mit Angular entstehen oder gewartet werden?
- Welche zwei Themen sind besonders wichtig?
- Ergebnis auf Flipchart; wird am Kursende (Grundkurs: Ende Tag 3, Kompakt: Ende Tag 5) abgeglichen.

### Folie 0.10 – Rückblick-Übung am Kursende: Technologieentscheidung (10 min, **nicht** am Tag 1)
*Erst nach dem Kurs sinnvoll, weil jetzt das nötige Wissen vorhanden ist.*
- Szenario: „Ein Versicherer plant ein Kundenportal, 8 Entwickler, 10 Jahre Laufzeit, 3 bestehende Backend-Teams.“
- Fragen: Passt Angular? Welche Teile aus dem Kurs sprechen dafür, welche Risiken sehen Sie?
- Ergebnis: je Gruppe (auch zu zweit oder allein möglich) 3 Argumente dafür und 3 Risiken.

> **Trainer:** Es gibt keine „richtige“ Antwort. Ziel ist, Entscheidungskriterien explizit zu machen (Skills, Lebensdauer, Teamgröße). Bei sehr kleinen Gruppen als Gespräch statt Gruppenarbeit durchführen.
