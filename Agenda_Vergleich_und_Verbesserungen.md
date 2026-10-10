# Vergleich Kursinhalt ↔ Agenda „Angular Kompaktkurs“ (it-schulungen.com)

Quelle Agenda: [Angular Kompaktkurs](https://www.it-schulungen.com/seminare/softwareentwicklung/angular/angular-kompaktkurs.html)
Verglichen mit: `presentation_angular21.pptx` (309 Folien, 30 Übungen), `Testing_angular21.pptx`, `State Management_angular21.pptx`, `Angular Material_angular21.pptx`, `Glossar.md`.

> **Wichtiger Hinweis zur Datenbasis:** Die Agenda-Seite war aus dieser Umgebung nicht direkt abrufbar (DNS-Fehler). Ich hatte nur eine Zusammenfassung über die Websuche. Sie nennt: 5 Tage; Standalone-first, Signals, Control Flow; Nx Workspace vs. Angular CLI; Vite/esbuild; Signal Inputs/Outputs; `@defer`/Lazy Loading; Testing mit Vitest (TestBed, Fixtures, Mocking von Services/Interceptors); Differential Builds, PWA/Service Worker; Nx affected; TypeScript/ES6, Data Binding, DI, Reactive Forms, HttpClient, Routing, RxJS, Security (XSS).
> Die Tag-für-Tag-Agenda konnte ich **nicht** verifizieren. Bitte die Punkte unten gegen die echte Agenda gegenprüfen. Mit dem eingefügten Agenda-Text kann ich den Vergleich präzisieren.

---

## 1. Gesamtbild

Die Schulung deckt die Kernthemen der Agenda inhaltlich gut ab und ist technisch aktuell (Angular 21, zoneless, Signals, Control Flow, `inject()`, funktionale Guards/Interceptors, Resource API, Vitest).

Es fehlen einzelne Themen, die die Agenda nennt oder die zu einem 5-Tage-Kompaktkurs gehören. Außerdem gibt es didaktische und strukturelle Schwächen.

| Agenda-Thema | Abdeckung | Fundstelle |
|---|---|---|
| TypeScript / ES6-Grundlagen | ✅ gut, aber zu lang | Folien 1–69, Übung `00`–`03` |
| Standalone-first, Bootstrapping | ✅ | Folien 85–93, `04`/`05` |
| Control Flow (`@if/@for/@switch`) | ✅ | Folien 105–108, `06` |
| Data Binding, Pipes | ✅ | Folien 99–102, 168–177 |
| Signal Input/Output, `computed` | ✅ | Folien 117–131, `08`–`10` |
| `effect()`, `linkedSignal`, `model()` | ⚠️ kaum/nicht | Folie 129 nur lokaler State |
| `@defer` / Lazy Loading | ⚠️ nur 1 Folie, keine Übung; Lazy Routes fehlen | Folie 141 |
| Dependency Injection (`inject`) | ✅ | Folien 156–163, `14`/`15` |
| Lifecycle | ✅ | Folien 164–167 |
| RxJS / Observables | ⚠️ Theorie, wenig Operatoren | Folien 178–193 |
| Routing (Parameter, Input-Binding) | ✅ | Folien 194–212 |
| Guards, Interceptors (funktional) | ✅ | Folien 253–255 |
| Reactive Forms + Validierung | ✅ (Signal Forms fehlen) | Folien 213–226 |
| HttpClient / Resource API | ✅ | Folien 242–258 |
| Testing (Vitest) | ✅ separates Deck, Rest Karma/Jasmine-lastig | `Testing_angular21` |
| Nx Workspace vs. Angular CLI | ❌ fehlt | – |
| Vite/esbuild Build-Pipeline | ❌ fehlt | – |
| PWA / Service Worker / Offline | ❌ fehlt | – |
| Differential Builds / Production Build / Deployment | ❌ fehlt | – |
| Security (XSS, Sanitizing, CSRF) | ❌ fehlt | – |
| SSR & Hydration | ⚠️ 1 Folie, keine Übung | Folie 268 |
| State Management | ✅ NgRx, Signal Store nur Ausblick | `State Management_angular21` |
| UI-Bibliothek | ✅ Material, nur 7 Folien | `Angular Material_angular21` |

---

## 2. Fehlende Themen (Ergänzungen)

### 2.1 Hohe Priorität (laut Agenda)

1. **Nx vs. Angular CLI / Monorepo**
   - Neues Kapitel „Workspace & Tooling“ (ca. 8 Folien): `create-nx-workspace`, Apps/Libs, Projektgraph (`nx graph`), Tags und Module Boundaries, `nx affected`, Caching.
   - Gegenüberstellung CLI-Workspace (mehrere Projekte) und Nx.
   - Übung `31_nx_workspace`: Eine App und eine Lib `customers-data` anlegen, `nx affected -t test` ausführen.
2. **Build-Pipeline: Vite / esbuild**
   - Application Builder (`@angular/build:application`), Dev-Server mit Vite, Unterschied zum alten Webpack-Builder.
   - `angular.json`: Budgets, Optimization, Source Maps, `ng build` vs. `ng build --configuration production`, Bundle-Analyse (`--stats-json`).
3. **Production Deployment**
   - Environments/Configurations, `base href`, Fallback-Routing auf dem Webserver (nginx-Beispiel), Docker-Image, CI-Pipeline-Skizze (lint → test → build → affected).
   - „Differential Builds“ ist seit esbuild/Browserslist veraltet. Auf der Folie die aktuelle Entsprechung nennen (Browserslist, moderne Targets) und kurz auf den Agenda-Begriff eingehen.
4. **PWA / Service Worker**
   - `ng add @angular/pwa`, `ngsw-config.json`, Caching-Strategien, `SwUpdate`, Offline-Verhalten testen.
   - Übung: App offline starten (DevTools → Offline).
5. **Security**
   - XSS und Angulars automatisches Sanitizing, `DomSanitizer`/`bypassSecurityTrust*` (und warum meiden), `[innerHTML]`.
   - CSRF/XSRF mit `withXsrfConfiguration`, CSP, JWT-Speicherung (Cookie vs. localStorage).
   - Kleine Übung: `[innerHTML]` mit Schadcode vor/nach Sanitizing.
6. **Lazy Loading und `@defer` vertiefen**
   - Lazy Routes (`loadComponent`, `loadChildren`), Preloading-Strategien.
   - `@defer` mit `@placeholder`, `@loading`, `@error`, Triggern (`on viewport`, `on interaction`, `when`, `prefetch`).
   - Übung `31_defer_lazy`. Bisher gibt es keine Übung zu `@defer` und keine zu Lazy Routes.

### 2.2 Mittlere Priorität

7. **Signals komplett:** `effect()` (Einsatz und Fallstricke), `linkedSignal`, `model()` für Two-Way-Binding, `resource` + Signals, `untracked`. Aktuell ist in den Folien kaum mehr als `signal` und `computed` zu finden. Das Glossar erwähnt `effect` bereits, die Folien nicht.
8. **RxJS praktisch:** `switchMap`, `debounceTime`, `distinctUntilChanged`, `combineLatest`, `catchError`/`retry`. Beispiel: Typeahead-Suche. Aktuell überwiegt Theorie (Callbacks, Promise-Vergleich), und `toSignal` kommt nur in einer Folie vor.
9. **Signal Forms** (neu in Angular 21, experimentell) kurz als Ausblick neben Reactive Forms. Außerdem typed Forms, `FormArray`, eigene Validatoren, asynchrone Validatoren (die Folien nennen Validierung, aber nicht die Kombinationen).
10. **SSR / Hydration:** Aus einer Folie ein Mini-Kapitel machen (`ng add @angular/ssr`, Hydration, `incremental hydration` mit `@defer`, Prerendering) plus Übung. Aktuell fehlt die Übung.
11. **Error Handling und Observability:** globaler `ErrorHandler`, Interceptor für Fehlerbehandlung, Fehlerseiten im Router.
12. **Performance:** `OnPush` (auch zoneless relevant), `track` richtig wählen, `NgOptimizedImage` (vorhanden), Bundle-Budgets, Lighthouse.

### 2.3 Niedrige Priorität / Optional

13. **Accessibility** (a11y, ARIA, Angular CDK a11y).
14. **i18n** (`$localize`, `ng extract-i18n`).
15. **Moderne Tooling-Themen:** ESLint (`angular-eslint`), Prettier, Angular DevTools, `ng update`/Migrations (Standalone-, Control-Flow-, Signal-Input-Migration als Schematics, sehr praxisnah für Bestandsprojekte).
16. **Angular Material / CDK:** auf 7 Folien sehr knapp. Theming (M3), Table/Paginator/Sort, Dialog, Snackbar, Reactive Forms mit Material.

---

## 3. Verbesserungsvorschläge an der bestehenden Schulung

### 3.1 Struktur und Dramaturgie

- **TypeScript ist zu lang (Folien 1–69, ca. 22 % des Decks).** Vorschlag: auf ca. 25–30 Folien straffen. Ältere Themen streichen oder in den Anhang verlegen: `var`-Scoping-Macken (Folien 16–21), Namespaces (63–66), Funktionsüberladung. Dafür aufnehmen: Generics, `readonly`, `as const`, Utility Types (`Partial`, `Pick`, `Omit`), Type Guards, async/await.
- **Legacy-NgModule am Ende (Folien 269–291) ist gut platziert.** Eine Folie „Wann braucht man das noch?“ plus „Migration via `ng generate @angular/core:standalone`“ ergänzen.
- **Reihenfolge der Übungen:** Übungsnummern und Foliennummern stimmen nicht durchgehend überein. Im Deck gibt es zwei „Übung 22“ (FormBuilder und Validierung, Folien 219 und 226), und `24_…` fehlt im Repo (Übungen springen von `23` auf `25`). Durchnummerieren und im Deck wie im Repo konsistent halten.
- **Übung 11–13 (Bindings/Class/Formulare)** sind im Repo als `11_image`, `12_selected`, `13_templateForms` benannt, die Foliennamen weichen davon ab. Namen angleichen.
- **Abschnitts-Folien** (Agenda je Tag am Anfang, „Was haben wir gelernt?“ am Ende) fehlen. Die Glossar-Gliederung in Tag 1 bis 3 ist hilfreich, im Deck aber nicht sichtbar. Das Deck in Tag 1 bis 5 gliedern, passend zur Agenda.
- **Tag 4/5 sind nur über Zusatzdecks abgedeckt.** Testing, State Management und Material liegen in getrennten Dateien. Eine Gesamtagenda-Folie (`Tag → Deck → Übungen`) hilft Teilnehmenden, den roten Faden zu erkennen.

### 3.2 Inhaltliche Aktualität und Konsistenz

- **Folie 129 (lokaler State mit Signals) steht nach der Output-Übung,** also am Ende des Komponenten-Kapitels. Signals sollten früher kommen (direkt nach Data Binding), weil sie danach in `input()`, `output()`, `computed` immer wieder auftauchen.
- **Folien 136 und 135 (Safe Navigator, Performance Impact):** „bei jeder Change Detection gecalled“ stimmt für Funktionsaufrufe im Template. Mit zoneless/Signals relativiert sich das. Ergänzen: Signals im Template sind billig, `computed` ist gecached.
- **Folie 190 (`async`-Pipe) vs. 192 (`toSignal`):** Empfehlung klar formulieren (heute `toSignal`/`httpResource`, `async`-Pipe als Alternative).
- **Folie 90 (Component-Beispiel)** nutzt `ApplicationRef, OnDestroy, OnInit`. Das ist unnötig komplex und passt nicht zum Rest. Auf ein schlankes Standalone-Beispiel mit `ChangeDetectionStrategy.OnPush` reduzieren.
- **Folie 189/190 (Unsubscribe):** `takeUntilDestroyed()` und `DestroyRef` ergänzen.
- **Testing-Deck:** Karma/Jasmine nimmt noch viel Raum ein (Folien 5–9, 11–22 mit Jasmine-Vokabular). Ab Angular 21 ist Vitest Standard. Ein durchgängiges Vitest-Beispiel (`vi.fn()`, `vi.spyOn`, `provideHttpClientTesting`, `HttpTestingController`, `fixture.componentRef.setInput` für Signal Inputs) fehlt. Das Cypress-Kapitel ist optional. Playwright als moderne Alternative in einer Folie erwähnen.
- **State Management:** NgRx klassisch (Store, Actions, Reducer, Effects) steht im Fokus, der **NgRx Signal Store** nur als Ausblick (Folie 21). In einer Signals-basierten Schulung sollte er stärker vertreten sein. Vorschlag: „Services mit Signals“ (einfachstes Muster) → Signal Store → klassisches NgRx als Vertiefung.

### 3.3 Didaktik

- **Mehr Übungen mit Lösungs- und Aufgabenzweig:** Jedes Übungsverzeichnis sollte eine `README.md` mit Aufgabe, Lernziel, Zeitbedarf und Lösungshinweisen haben. Aktuell enthält das Repo keine README im Wurzelverzeichnis (nur `Glossar.md`).
- **Zeitplanung:** Ein Zeitraster je Tag (Vormittag/Nachmittag, Anteile Theorie/Übung) in einer Folie und im Trainerleitfaden.
- **Ein durchgehendes Projekt:** Die Übungen bauen auf einem Customer-Beispiel auf, aber in getrennten Ordnern. Ein Abschlussprojekt am Tag 5 (Zusammenführung: Routing + Forms + HTTP + State + Test) schließt den Bogen.
- **Kontrollfragen/Quiz** am Ende jedes Kapitels (3–5 Fragen). Das Glossar bietet sich dafür an.
- **Aufräumen im Repo:** `~$presentation.pptx` (Office-Lockdatei), `grundlagen_wiederholung - Kopie`, die alten Decks (`presentation.pptx/.pdf`) neben den `_angular21`-Versionen sowie `TASK RESULT Recommendations.txt` und `TODO_Presentation.txt` (Arbeitsnotizen) sollten in einen Ordner `archiv/` oder nach `.gitignore`. Das schafft Übersicht.

### 3.4 Glossar

- Das Glossar (Tag 1 bis 3) ist gut. Ergänzen: `effect`/`linkedSignal` mit Beispiel, Hinweis auf Tag 4/5 (Testing, State, Material, Build/Deployment, Security, PWA), Querverweise auf Folien- und Übungsnummern.

---

## 4. Vorgeschlagene 5-Tage-Gliederung (an die Agenda angelehnt)

| Tag | Themen | Decks / Übungen |
|---|---|---|
| 1 | TypeScript (gestrafft), Workspace/CLI, Nx-Überblick, Standalone, Bootstrapping, Templates, Data Binding, Control Flow, Signals | Folien 1–69 (gekürzt), 70–110, `00`–`06` + neu: Nx |
| 2 | Komponenten (Input/Output/`model`), Services & DI, Lifecycle, Pipes, `@defer` | Folien 111–177, `07`–`18` + neu: `@defer` |
| 3 | RxJS & Signals-Interop, Routing (Lazy, Guards), Forms | Folien 178–233, `19`–`23` + neu: RxJS-Typeahead, Lazy Routes |
| 4 | HttpClient, Interceptors, Resource API, Security, State Management, Material | Folien 234–267, `25`–`29`, State- und Material-Deck + neu: XSS-Übung |
| 5 | Testing (Vitest), SSR/Hydration, Build (esbuild/Vite), PWA, Deployment, `nx affected`/CI, Abschlussprojekt | Testing-Deck, neu: SSR, PWA, Deployment, Projekt |

Bei Zeitnot: Cypress, klassisches NgRx (Details) und Legacy-NgModule in den Anhang oder als Wahlthema.

---

## 5. Nächste Schritte (Vorschlag)

1. Echte Agenda hier einfügen, dann gleiche ich Tag für Tag exakt ab.
2. Neue Folien/Übungen priorisieren: Nx, Build/Deployment, PWA, Security, `@defer`/Lazy, `effect`/`linkedSignal`, Vitest-Praxis.
3. Repo aufräumen und eine Wurzel-`README.md` mit Kursplan und Übungsverzeichnis anlegen.
4. Foliennummern und Übungsnummern bereinigen (doppelte „Übung 22“, fehlende `24`).
