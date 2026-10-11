# Übungskette: Entscheidungen, Umbau und tatsächlicher Stand

Grundlage: Ordner `04_…` bis `38_…` und `Z1_reactive_forms`, jeweils ein vollständiger `invoice-app`-Snapshot **mit der Lösung** der Übung. Jede Übung startet vom Ergebnis der vorherigen (04…29 und 31…38 aufbauend; `30_modules_legacy` ist eine eigene Basis; `24` existiert nicht, Übung 24 steckt in `23_communication`).

## 1. Entscheidungen (umgesetzt)

| Thema | Entscheidung | Stand |
|---|---|---|
| Forms | **Option A:** Reactive Forms fliegen aus dem Hauptpfad, `customer-details` nutzt ein einfaches Template-Driven Form (`FormsModule`/`ngModel`) | umgesetzt in 22, 23, 25, 26, 27, 28, 29 |
| Reactive Forms | als Wahlthema in `Z1_reactive_forms` gesichert (Kopie des alten `22_forms`) | angelegt |
| Test-Runner | **Vitest** statt Karma/Jasmine (Angular-21-Builder `@angular/build:unit-test`) | alle Ordner 04–38 und Z1 umgestellt |
| Neue Übungen | 31–38 als eigene Projektordner mit Lösung, `Aufgabe.md`, `readme.txt` | angelegt |

## 2. Ausgangslage (Kurzfassung)

- `13_templateForms` ist eine Sackgasse: `ngModel` aus Übung 13 ist in `14_service` nicht mehr enthalten.
- Das Reactive Form steckte nur in `22`, `23` und `25`–`29` (`customer-details`). `30_modules_legacy` hat ein eigenes Formular (`training-details`, Reactive) und blieb bewusst unverändert.
- Alle Snapshots hatten `karma`/`jasmine-core`, `src/test.ts`, `src/polyfills.ts` und `karma.conf.js`. Die `*.spec.ts`-Dateien waren unveränderte `ng generate`-Gerüste mit `declarations: [StandaloneComponent]`. Sie konnten gar nicht laufen (Standalone-Komponenten dürfen nicht deklariert werden). Jasmine-Spezifika (`createSpyObj`, `spyOn`) gab es nirgends.
- `15_dependencyInjection` hatte noch den alten `browser`-Builder (`main`, `polyfills`-String).

## 3. Toolchain: Vitest (alle Ordner)

Je Ordner geändert:

- `package.json`: `@angular-devkit/build-angular`, `karma*`, `jasmine-core`, `@types/jasmine`, `@types/node` entfernt; `@angular/build ^21`, `vitest ~4.0.18`, `jsdom ^28` ergänzt.
- `angular.json`: Builder auf `@angular/build:application` / `:dev-server` / `:extract-i18n`; `test` = `@angular/build:unit-test` (Runner `vitest`, `tsConfig: tsconfig.spec.json`). `polyfills` entfällt (nur `30` behält `["zone.js"]`, weil dort NgModule und Zone.js laufen).
- `tsconfig.spec.json`: `types: ["vitest/globals"]` (kein Import von `describe`/`it`/`expect`/`vi` nötig); `tsconfig.app.json`: nur noch `src/main.ts`; `tsconfig.json`: `skipLibCheck: true` (Vitest-Typen brauchen es).
- Entfernt: `karma.conf.js`, `src/test.ts`, `src/polyfills.ts`. `package-lock.json` neu erzeugt (in jedem Ordner, auch dort, wo vorher keiner lag).
- Alle Specs neu geschrieben (siehe Abschnitt 6). Mocks mit `vi.fn()`/`vi.spyOn()`.

**Stolpersteine**

- `vitest` ist auf `~4.0.18` gepinnt: Mit npm 10.9.x bricht `npm install` bei `vitest@4.1.x` mit `Cannot read properties of null (reading 'edgesOut')` ab (Fehler im npm-Resolver; mit npm 11 funktioniert `^4.0.8`). `npm audit` meldet für `vitest ≤ 4.1.10` eine Warnung (nur Entwicklungswerkzeug, nicht im Bundle). Sobald alle auf npm 11 sind, kann der Pin zu `^4` gelockert werden.
- Ein `fixture.whenStable()` blockiert, solange eine HTTP-Anfrage (HttpTestingController) offen ist. Erst `fixture.detectChanges()`, dann `flush()`, dann `whenStable()`.
- Asynchrone Store-Methoden (`await firstValueFrom(...)`) setzen ihre Signals erst nach der Promise-Kette. Die Specs warten dafür ein `setTimeout(0)` ab, bevor sie das DOM prüfen.
- Effects in Tests: `TestBed.tick()` führt anstehende Effects aus.
- `30_modules_legacy` (NgModule + Zone.js): geht mit Vitest. `AppComponent` ist nicht standalone und im AOT-Build der Tests nur über `AppModule` erreichbar, daher importiert die Spec das `AppModule`. Außerdem löst `training-details` den Request doppelt aus (Komponente und `async`-Pipe abonnieren beide); die Spec hält das fest.
- Weil Angular 21 zoneless testet (ohne `zone.js/testing`), ist `zone.js` in den zoneless Projekten nur noch ein unbenutzter Eintrag in `dependencies`. Er wurde nicht entfernt, um die Ordner nicht weiter zu verändern.

## 4. Forms Option A (22, 23, 25–29)

In `customer-details` (`.ts`, `.html`, `.spec.ts`, `.css`):

- `FormsModule`, Felder Vorname, Nachname, Straße, PLZ, Stadt, Datum der letzten Bestellung per `[(ngModel)]` (Datum: `[ngModel]` mit `date`-Pipe in `UTC` plus `(ngModelChange)`, weil `type="date"` einen String liefert).
- Der geladene Kunde bleibt unverändert: `draft = linkedSignal(() => { const c = this.customer(); return c ? { ...c } : undefined; })`. Der `patchValue`-`effect` entfällt. Im Template: `@if (draft(); as c)`; `[(ngModel)]="c.firstname"` kompiliert.
- Validierung per HTML-Attribut: Vor- und Nachname `required`, PLZ `pattern="[0-9]*"`; Fehlermeldungen mit `@if (feld.invalid && feld.dirty)`; Speichern-Button `[disabled]="customerForm.invalid"`.
- Ladestrategie je Stand unverändert: 22 synchron aus dem Mock (`computed`), 23/25 `effect` + `subscribe` in ein Signal, 26–29 `rxResource`. 29 behält die `CardComponent` (Speichern-Button im Footer-Slot mit `form="customer-form"`).
- Ü22 enthält nur Anzeige und Bearbeiten (kein Speichern-Button, stattdessen Formularstatus „gültig/ungültig“); Speichern über den Service ist weiterhin Ü23.
- `Aufgabe.md` von 22 (komplett neu: „Übung 22: Kunde bearbeiten (Template-Driven Form)“), 23, 26, 27, 29 angepasst; `readme.txt` in 22, 23, 25–29 bereinigt (alte Notizen zu `formGroupName` entfernt, Startanleitung für Backend und Proxy).
- `Z1_reactive_forms`: Kopie des alten `22_forms` (Code unverändert, nur Toolchain/Specs auf Vitest), `Aufgabe.md`-Titel „Wahlübung Z1: Reactive Forms mit FormBuilder und Validierung“, `readme.txt`. Hinweis: Der Code enthält das Formular mit `FormBuilder`, aber noch keine Validatoren; die Validierung (Aufgaben 3–5 der alten Übung) bleibt der Teil zum Selbermachen.

Wechselwirkung mit Kapitel 2: Der `patchValue`-`effect` war als „Brücke zu nicht-signalbasierter API“ gedacht und fällt weg. Kapitel 2 arbeitet bewusst mit `CustomerListComponent` (Filter → `localStorage`) und ist von Forms unabhängig. Als neues Mini-Beispiel für `linkedSignal` dient die bearbeitbare Kopie in Ü22.

## 5. Neue Übungen 31–38

Jeder Ordner enthält `invoice-app` (Lösung), `Aufgabe.md` und `readme.txt`, aufbauend auf dem Vorgänger (31 ← 29).

| Ü | Ordner | Inhalt der Lösung |
|---|---|---|
| 31 | `31_komponenten_aufteilen` | `CustomerFilterComponent` (`value`, `changed`, `cleared`, `viewChild`-Fokus) und `CustomerListItemComponent` (`li[customer-list-item]`, `customer`, `selected`, `chosen`); Liste behält Laden, Filter- und Auswahlzustand; Verhalten unverändert (unveränderte Listen-Spec bleibt grün) |
| 32 | `32_reaktivitaet` | `computed` statt Methode/Pfeilfunktion, `effect` → `localStorage` (Filter, mit Wiederherstellung); `Aufgabe.md` enthält den Patch mit den 3 absichtlichen Fehlern; Lösung = korrigierter Stand (`computed`, lokaler Demo-Zustand per `update` mit Spread) |
| 33 | `33_state_store` | `customer.store.ts` (private Signals, `asReadonly`, `computed`, `load/setFilter/select/addDemo`, `localStorage`-Effect im Store); Liste nutzt nur den Store; `CustomerService` wird reine API-Schicht (`getAll()` ohne `ReplaySubject`); `@ngrx/signals` nur beschrieben |
| 34 | `34_tests` | Specs für Store (inkl. Fehlerfall, Effect), Item, Filter, Service (`HttpTestingController`); `material/generierter-store-test.spec.ts.txt` mit 5 Schwächen (`toBeTruthy`, Tautologie, Over-Mocking, fehlender Fehlerfall, Happy Path); die verbesserte Spec ist `customer.store.spec.ts`. Mutationstest geprüft: `includes` → `startsWith` bleibt in der generierten Spec grün, in der verbesserten Spec rot |
| 35 | `35_performance` | Lastgenerator (`LOAD_TEST_SIZE`, 5000, 0 = aus) im Store; `track customer.id`/`trackBy`, `OnPush`, Debounce 250 ms, Virtual Scrolling (`@angular/cdk`), Lazy Route für `customer-details`; Ergebnis-Tabelle als Vorlage in `Aufgabe.md` |
| 36 | `36_sicherheit` | `note?: string` (für Kunde 1 clientseitig im `CustomerService`), Interpolation / `[innerHTML]` / `bypassSecurityTrustHtml` in getrennter `NoteDemoComponent` hinter Checkbox (bewusst unsicher, kommentiert); `returnUrl`-Allowlist (`safeReturnUrl`, Guard hängt `returnUrl` an); Interceptor loggt nur Methode/URL/Status; `material/review-checkliste.md` |
| 37 | `37_ki_review` | `material/ki-vorschlag.md` (CSV-Export mit `*ngIf`, `any`, `effect`, das ein Signal schreibt, `innerHTML`, `toBeTruthy`-Test u. a.); Lösung = geprüfte Fassung: `toCsv`/`escapeCsvField` (RFC-4180-Quoting, Formel-Schutz), `CustomerExportButtonComponent` (Blob-Download), Tests |
| 38 | `38_abschluss` | `/dashboard` (lazy, `authGuard`): Kunden gesamt, aktive der letzten 7 Tage (`CurrentActiveCustomersPipe` wiederverwendet), Kunden pro Stadt als `computed` aus dem Store; Navigation in `AppComponent`; 7 Dashboard-Tests plus Routen-Tests |

## 6. Abweichungen vom Plan und von den Kapitel-Dateien

- **Specs:** Alle vorhandenen Specs waren nicht lauffähig und wurden neu geschrieben (nicht nur umgeschrieben). 04–21 sind kleine Smoke-Specs (`should create`, Titel, Überschrift); ab 22 inhaltliche Tests (Formular, Liste, Service, Store …).
- **Builder:** Zusätzlich zum Test-Target wurden `build`/`serve`/`extract-i18n` auf `@angular/build` umgestellt (sonst bräuchte jeder Ordner weiterhin `@angular-devkit/build-angular` und Webpack). `15_dependencyInjection` bekam dafür die `angular.json` von `14` (der alte `browser`-Builder war inkompatibel).
- **Ü33:** Es gibt keine `CustomerApi` (Kapitel 3 und 4 nennen sie). Der Store nutzt den bestehenden `CustomerService`, der dafür zur reinen API-Schicht umgebaut wurde (kein `ReplaySubject`, kein Laden im Konstruktor, kein Nachladen nach `update`). In Ü34 wird deshalb `CustomerService` per `providers` ersetzt. Datumsfelder werden im Service gemappt, was die Dashboard-Logik braucht (`httpResource` hatte nur Strings geliefert).
- **Ü35:** Der Lastgenerator ist ein `InjectionToken` (`LOAD_TEST_SIZE`) statt einer Konstante, damit Tests ihn abschalten können. Die Zeilenkomponente nutzt ab Ü35 den Selektor `[customer-list-item]` (statt `li[...]`), weil sie im Virtual-Scroll-Viewport in einem `div` steckt. Der Lastgenerator ist in der Lösung 35 an, ab 36 aus.
- **Ü36:** Die Notiz wird im `CustomerService` (nicht im Store) ergänzt, weil die Detailseite den Kunden über den Service lädt. Zusätzlich behoben: `encodeURIComponent` für IDs in Request-URLs (als Fund in der Checkliste dokumentiert). Der Interceptor loggt statt des ganzen Fehlerobjekts nur noch den Status.
- **Ü37:** Die Befundliste im Material geht über die fünf geforderten Fehler hinaus (`@Input`, `data:`-URL, CSV-Injection u. a.).
- **Ü38:** `/dashboard` wurde zusätzlich in die `returnUrl`-Allowlist aufgenommen, sonst würde der Rücksprung nach dem Login verworfen.
- **Material-Ort:** `material/` liegt im Übungsordner neben `Aufgabe.md` (nicht im `invoice-app`).
- **Bekannter Befund aus 29:** `CommonModule` in `customer-details` (Bundle-Hygiene, geplant für Ü35) existiert nach dem Forms-Umbau nicht mehr; Ü35 weist in den Hinweisen darauf hin.
- **Nicht angefasst:** `30_modules_legacy/readme.txt` (alter Hinweis auf `formGroupName`), Ordner `24` (existiert weiter nicht), `server/`, Folien und Glossar.
- **`.env`:** Die in 23–29 eingecheckte `.env` (Pfade eines fremden Rechners) wurde nicht in die neuen Ordner 31–38 übernommen und nicht gelöscht.

## 7. Verifikation

Alle Ordner wurden mit `ng build` und `ng test --watch=false` geprüft (gemeinsames `node_modules` per Symlink, danach entfernt). Zusätzlich:

- `npm ci` + `ng build` + `ng test` in einer sauberen Kopie von `38_abschluss` und `30_modules_legacy` (ohne Symlink).
- Playwright/Chromium Ende-zu-Ende mit Backend (`server/`, `ng serve --proxy-config dev.proxy.json`): `29_contentProjection` (Anmeldung, Liste, Kunde öffnen, Validierung, Namen ändern, speichern, Server-Stand prüfen, Zurück ohne Speichern) und `38_abschluss` (Dashboard über `returnUrl`, Filter mit Debounce, Auswahl, CSV-Download, Notiz-Varianten inklusive `alert` nur bei der unsicheren Variante, Speichern, 403 Kunden mit Virtual Scrolling, Dashboard-Zahlen, Allowlist). Dazu Kurz-Smoke-Tests für 31–37.
- Ergebnisse je Ordner (alle 35 Ordner grün):

| Ordner | `ng build` | `ng test --watch=false` | Tests |
|---|---|---|---|
| `04_initial_project` | grün | grün | 3 |
| `05_initial_project` | grün | grün | 3 |
| `06_directives` | grün | grün | 3 |
| `07_subcomponents` | grün | grün | 4 |
| `08_input` | grün | grün | 4 |
| `09_clickEvent` | grün | grün | 4 |
| `10_outputEvent` | grün | grün | 5 |
| `11_image` | grün | grün | 5 |
| `12_selected` | grün | grün | 5 |
| `13_templateForms` | grün | grün | 5 |
| `14_service` | grün | grün | 5 |
| `15_dependencyInjection` | grün | grün | 5 |
| `16_lifecycle` | grün | grün | 5 |
| `17_datePipe` | grün | grün | 5 |
| `18_customPipe` | grün | grün | 5 |
| `19_observables` | grün | grün | 5 |
| `20_router` | grün | grün | 2 |
| `21_dynamic_routes` | grün | grün | 2 |
| `22_forms` | grün | grün | 7 |
| `23_communication` | grün | grün | 12 |
| `25_httpInterceptorGuard` | grün | grün | 12 |
| `26_resourceApi` | grün | grün | 12 |
| `27_ngOptimizedImage` | grün | grün | 12 |
| `28_viewChild` | grün | grün | 14 |
| `29_contentProjection` | grün | grün | 14 |
| `30_modules_legacy` | grün | grün | 9 |
| `31_komponenten_aufteilen` | grün | grün | 16 |
| `32_reaktivitaet` | grün | grün | 19 |
| `33_state_store` | grün | grün | 20 |
| `34_tests` | grün | grün | 49 |
| `35_performance` | grün | grün | 54 |
| `36_sicherheit` | grün | grün | 87 |
| `37_ki_review` | grün | grün | 104 |
| `38_abschluss` | grün | grün | 116 |
| `Z1_reactive_forms` | grün | grün | 2 |

## 8. Offene Punkte

- Folien: Kapitel 4 nennt Karma/Jasmine nur in einer Gegenüberstellung; die Folien zu Forms (213–226) sind noch in den Hauptfolien (Verschieben ins Wahlthema: Aufgabe der Deck-Arbeit).
- `vitest`-Pin (`~4.0.18`) bei Gelegenheit lockern.
- `30_modules_legacy`: doppelter HTTP-Request in `training-details` ist ein Befund im Altcode, wurde nicht behoben.
