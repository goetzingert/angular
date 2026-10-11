# Vergleich Kursinhalt ↔ Agenda „Angular Kompakt“ (5 Tage) und „Angular Grundkurs“ (Tag 1–3)

Agenda-Quelle: [Angular Kompaktkurs, it-schulungen.com](https://www.it-schulungen.com/seminare/softwareentwicklung/angular/angular-kompaktkurs.html) (Inhalte vom Trainer bereitgestellt).
Verglichen mit: `presentation_angular21.pptx` (309 Folien, 30 Übungen), `Testing_angular21.pptx` (32), `State Management_angular21.pptx` (21), `Angular Material_angular21.pptx` (7), `Glossar.md`, Übungsordner `00`–`30`.

> Die erste Fassung dieses Dokuments beruhte auf einer ungenauen Zusammenfassung der Agenda (Nx, PWA, Deployment, Build). Das war falsch und ist hier korrigiert. Die echte Agenda ist **konzeptorientiert**: Entscheidungskriterien, Architektur, Wartbarkeit, Sicherheit und KI statt Tooling.

---

## 1. Kernbefund

Die Folien vermitteln bisher vor allem das **Wie** (Syntax, APIs, Übungen). Die Agenda verlangt zusätzlich das **Warum und Wann**: Kriterien für Aufteilung, Wechsel zu strukturiertem Zustand, Zusammenhang von Struktur und Testbarkeit bzw. Rendering, Vertrauensgrenzen, Grenzen der KI.

- **Gut abgedeckt (Grundkurs):** Komponenten, Templates, Services/DI, Routing, HttpClient, Signals-Basics.
- **Teilweise:** Reaktivität (kein `effect`, keine Stolperfallen), Testing (Karma/Jasmine-lastig, keine Architekturbezüge), State Management (NgRx-Technik, aber keine Entscheidungskriterien).
- **Fehlt komplett:** Sicherheit, KI-gestützte Entwicklung, Performance (Laufzeit, Rendering, Change Detection), Einordnung im Frontend-Umfeld, Wartbarkeit/Architekturentscheidungen.
- **Nicht in der Agenda, aber im Material:** Angular Material, Cypress, Legacy-NgModule, ausführliches TypeScript (22 % der Folien) und der NgRx-Detailteil. Das sind Kandidaten zum Kürzen oder für den Anhang.

---

## 2. Abgleich Grundkurs (Tag 1–3)

| Agenda-Punkt | Abdeckung | Fundstelle / Lücke |
|---|---|---|
| Einordnung im modernen Web-Stack, Architekturprinzipien | ⚠️ dünn | Folien 70–72 („Architektur Überblick“). Es fehlen Vergleich mit React/Vue/Svelte, Meta-Frameworks, SPA vs. SSR, Angular-Releasezyklus |
| Angular-Denkweise, zentrale Konzepte | ✅ | Folien 85–93, Glossar (Metaphern) |
| Aufbau/Zusammenspiel von Komponenten | ✅ | Folien 111–131, Übungen `07`–`10` |
| Verantwortlichkeiten, Wiederverwendbarkeit, Komposition | ⚠️ | Smart/Dumb nur Folie 228, Content Projection Folien 265–267 (`29`). Als Entscheidungsrahmen fehlen Beispiele und Gegenbeispiele |
| Moderne reaktive Logik / Zustand | ⚠️ | Folie 129 (`signal`, `computed`), `toSignal` Folie 192. Fehlt: `effect`, `linkedSignal`, `model` |
| Auswirkungen auf Wartbarkeit/Testbarkeit | ❌ | nicht behandelt |
| Strukturierung von Templates, Steuerung von Darstellung/Logik | ✅ | Control Flow Folien 105–108 (`06`), `@defer` Folie 141 |
| Routing, Strukturierung größerer Anwendungen | ⚠️ | Folien 194–212, `20`/`21`. Fehlen: Lazy Routes (`loadComponent`/`loadChildren`), Feature-Routen, verschachtelte Routen |
| Navigation und Zustandsübergänge | ⚠️ | Guards/Interceptors Folien 253–255 (`25`), aber erst spät (Tag 4-Material). Resolver und Navigationszustand (Query-Params als Zustand) fehlen |
| Services: Kapselung, Zugriff auf externe Daten | ✅ | Folien 145–163, 242–250 (`14`, `15`, `26`) |
| Trennung UI und Fachlogik | ⚠️ | implizit über Services, aber nie als Prinzip benannt |
| Vorbereitung auf Testing/Performance/Skalierung, Abgrenzung | ❌ | Überleitung fehlt |

**Folgerung für Tag 3:** Der Grundkurs endet inhaltlich bei Folie ca. 250. Forms (Folien 213–226) gehören nicht zur Agenda. Sie können als optionales Zusatzthema oder in Tag 4 laufen. Dafür braucht der Grundkurs einen **Abschluss-Block** („Was haben wir gebaut, was kommt im Aufbau?“).

---

## 3. Abgleich Aufbau (Tag 4–5, nur Kompakt)

### 3.1 Reaktivität und Datenfluss

| Agenda-Punkt | Abdeckung | Vorschlag |
|---|---|---|
| Steuerung von Zustandsänderungen und UI-Reaktionen | ⚠️ | Zoneless und Signals-Änderungserkennung erklären (Glossar nennt es, Folien nicht) |
| Konsistente, nachvollziehbare Datenflüsse | ⚠️ | Einwegdatenfluss Folie 138; Datenflussdiagramm je Beispiel ergänzen |
| Lokaler vs. abgeleiteter Zustand | ⚠️ | `signal` vs. `computed` gegenüberstellen, Regel „so wenig Quellzustand wie möglich“, Anti-Beispiel: abgeleiteter Wert als eigenes Signal |
| Nebenwirkungen einordnen | ❌ | `effect()` einführen: wann ja (Logging, localStorage, DOM-API), wann nein (Zustand synchronisieren). Alternativen `computed`, `linkedSignal`, Event-Handler |
| Stolperfallen bei wachsender Reaktivität | ❌ | Zyklen und Endlosschleifen in `effect`, Signals mutieren statt ersetzen (Objekte/Arrays), `ExpressionChangedAfterItHasBeenChecked`, `toSignal` ohne Initialwert, unnötige Subscriptions |

Neue Übung: „Reaktivitäts-Falle finden“ – ein kaputtes Projekt mit 4–5 typischen Fehlern, die Teilnehmende per Debugging beheben.

### 3.2 Anwendungsstruktur und Zustandsverwaltung

| Agenda-Punkt | Abdeckung | Vorschlag |
|---|---|---|
| Strukturierung bei wachsender Komplexität, Trennung von Zuständigkeiten | ❌ | Ordnerstruktur (Feature-/Layer-Struktur), Smart/Dumb, Facade, Verzeichnis-Konventionen |
| Strukturierte Modelle für Zustandsverwaltung | ✅/⚠️ | `State Management`-Deck: v1→v3.1 (Entwicklung), NgRx Store/Actions/Reducer/Effects |
| Trennung Zustand, Logik, Darstellung | ⚠️ | im Deck nur technisch (Reducer/Effects); als Grundprinzip herausarbeiten |
| Kriterien für den Wechsel zu strukturiertem Zustand | ❌ | Entscheidungsfolie: Service+Signal → Signal Store → NgRx. Kriterien: Anzahl Konsumenten, Nachvollziehbarkeit/Debugging, Seiteneffekte, Teamgröße |
| Umgang mit wachsender Zustandskomplexität | ⚠️ | Normalisierung, Selektoren, abgeleiteter Zustand |

Der **NgRx Signal Store** liegt nur als Ausblick vor (Folie 21). Passend zu „Strukturierte Modelle“ und zum Signals-Fokus sollte er eine eigene Übung bekommen. Das klassische NgRx kann dafür etwas gestrafft werden.

### 3.3 Qualitätssicherung und Wartbarkeit

| Agenda-Punkt | Abdeckung | Vorschlag |
|---|---|---|
| Rolle von Tests | ✅ | Testpyramide (Testing-Deck Folie 2) |
| Wartbarkeit im Kontext von Architekturentscheidungen | ❌ | 3–4 Folien: Kopplung, Kohäsion, Abhängigkeitsrichtung, Beispiel „Komponente mit HttpClient direkt“ vs. „über Service“ |
| Merkmale stabiler, nachvollziehbarer Codebasen | ❌ | Checkliste: Namenskonventionen, kleine Komponenten, ESLint, Typisierung (`strict`) |
| Zusammenhang Struktur ↔ Testbarkeit | ⚠️ | Vorher/Nachher: schwer testbare Komponente refaktorieren |
| Abhängigkeiten beim isolierten Testen | ✅ | Testing-Deck Folien 17–18 (DI, Mocking) |
| Automatisiert erzeugte Tests einordnen | ❌ | KI-generierte Tests bewerten (siehe 3.6): Assertions prüfen, Tautologien, Over-Mocking, Coverage ≠ Qualität |

Zu überarbeiten: Das Testing-Deck startet mit Karma/Jasmine (Folien 5–9). Ab Angular 21 ist Vitest Standard; das sollte den Hauptpfad bilden, Karma nur Hinweis für Bestandsprojekte. Konkret ergänzen: `HttpTestingController`, `fixture.componentRef.setInput` für Signal Inputs, Tests von `computed`/`effect` (`TestBed.tick()`). Cypress ist nicht in der Agenda und kann in den Anhang (oder Playwright-Hinweis in einer Folie).

### 3.4 Performance und Laufzeitverhalten

| Agenda-Punkt | Abdeckung | Vorschlag |
|---|---|---|
| Einordnung von Performance | ❌ | Messen vor Optimieren: Lighthouse, Angular DevTools Profiler, Core Web Vitals |
| Auswirkungen von Struktur/Datenfluss auf Laufzeit | ❌ | Change Detection: Zone vs. zoneless, `OnPush`, Signals-Granularität |
| Vorbereitung auf skalierende Anwendungen | ⚠️ | `@defer`, Lazy Routes, `NgOptimizedImage` (Folie 259–261, `27`), SSR/Hydration (Folie 268, ohne Übung) |
| Zusammenhang Zustandsstruktur ↔ Rendering | ❌ | Ein großes Objekt-Signal vs. viele kleine Signals/`computed`; `track` in `@for` (Folie 105 erwähnt es nur) |
| Typische Ursachen für Laufzeitprobleme | ❌ | Funktionsaufrufe im Template (Folie 136 vorhanden), große Listen ohne `track`, Subscriptions-Lecks, zu große Bundles |

Neue Übung: „Langsame Liste“ – Projekt mit 5000 Zeilen, Teilnehmende messen, finden Ursachen (`track`, `computed`, `OnPush`, `@defer`) und messen erneut.

### 3.5 Sicherheit und verantwortungsvoller Einsatz

Aktuell **nichts** im Material. Vorschlag für 8–10 Folien und eine Übung:
- Vertrauensgrenzen: Alles aus Eingabe, URL, Route-Params, API und `localStorage` ist untrusted.
- XSS: Angular-Sanitizing automatisch, `[innerHTML]`, `DomSanitizer.bypassSecurityTrust*` (und warum meiden), Template-Injection.
- Gängige Risiken: Tokens in `localStorage`, CSRF/XSRF (`withXsrfConfiguration`), unsichere Abhängigkeiten (`npm audit`), Secrets im Frontend-Bundle, CSP, offene Redirects über Routen-Parameter.
- Zusammenspiel: Client-Validierung ist UX, Server-Validierung ist Sicherheit (Folie 221 „2-fache Validierung“ kann hier anknüpfen).
- Übung: `[innerHTML]` mit Schadcode, danach Fix.

### 3.6 KI-gestützte Entwicklung

Aktuell **nichts** im Material. Vorschlag für ein eigenes Kapitel (ca. 12 Folien plus 2 Übungen), Tag 5:
- Einordnung: Chat, IDE-Assistent, Agenten; was sie können und was nicht.
- Zusammenarbeit: Kontext liefern (Projektregeln, `CLAUDE.md`/Rules-Datei, Angular-Konventionen, `angular.dev/llms.txt`-artige Quellen), klein schneiden, mehrere Runden (Plan → Umsetzung → Review → Korrektur).
- Vorschläge bewerten: Review-Checkliste (kompiliert es? passt es zur Architektur? Standalone/Signals oder veralteter Stil? Sicherheit? Tests echt?).
- Typische KI-Fehler bei Angular: veraltete APIs (`*ngIf`, `@Input()`, NgModules), erfundene Methoden, `effect` für alles, `any`, zu viel Code ohne Tests.
- Grenzen/Fehlannahmen: Halluzinationen, Datenschutz (keine Secrets/Kundendaten in Prompts), Lizenzfragen, Verantwortung bleibt beim Entwickler.
- Übung 1: KI soll eine Komponente erzeugen; die Gruppe reviewt und korrigiert sie gegen die Checkliste.
- Übung 2: KI-generierte Tests bewerten (Verbindung zu 3.3).

---

## 4. Konkrete Verbesserungen am bestehenden Material

### 4.1 Straffen / verschieben (nicht in Agenda)
- **TypeScript (Folien 1–69):** auf ca. 25–30 Folien kürzen. Streichen oder in den Anhang: `var`-Scoping (16–21), Namespaces (63–66), Funktionsüberladung. Stattdessen: Generics, Utility Types, Type Guards, Strict-Modus (passt zu „stabile Codebasen“).
- **Angular Material (7 Folien), Cypress (Folien 24–32 im Testing-Deck), Legacy-NgModule (Folien 269–291), Forms (213–226):** als Wahl-/Anhang-Themen kennzeichnen, damit Zeit für Sicherheit, KI, Performance bleibt.
- **Node/npm-Anhang (Folien 292–309)** bleibt Anhang.

### 4.2 Konsistenz und Hygiene
- Doppelte „Übung 22“ (Folien 219 und 226); im Repo fehlt `24_…` (`23` → `25`). Durchnummerieren und mit den Folien abgleichen.
- Folie 90 (Component-Beispiel mit `ApplicationRef`, `OnDestroy`) ist zu komplex für den Einstieg.
- Signals (Folie 129) kommen im Deck erst spät; früher einführen, direkt nach Data Binding.
- Repo-Altlasten in `archiv/` verschieben oder aufräumen: `~$presentation.pptx`, `grundlagen_wiederholung - Kopie`, alte Decks ohne `_angular21`, `TASK RESULT Recommendations.txt`, `TODO_Presentation.txt`.
- Wurzel-`README.md` mit Kursplan (Grundkurs vs. Kompakt), Zuordnung Deck → Tag → Übungen. Jedes Übungsverzeichnis mit kurzer `README.md` (Ziel, Aufgabe, Zeit).

### 4.3 Didaktik passend zur Agenda
- **Entscheidungsfolien statt nur Syntax:** „Wann Service, wann Signal Store, wann NgRx?“, „Wann `effect`, wann `computed`?“, „Wann neue Komponente?“ Jeweils als Tabelle mit Kriterien.
- **Vorher/Nachher-Refactorings** als Übungsform (Wartbarkeit, Testbarkeit, Performance).
- **Fehlersuche-Übungen** (Reaktivität, Sicherheit, KI-Review) – aktiv statt Frontalunterricht.
- **Abschlussprojekt** am Tag 5: ein kleines Feature mit KI-Unterstützung bauen, Review, Tests, Performance-Messung.

---

## 5. Vorschlag Tagesgliederung

Der Grundkurs (3 Tage) reicht mit den Übungen nur bis ca. Ü24 (HTTP-Anbindung). Ü25–29 (Guards/Interceptors, Resource API, NgOptimizedImage, viewChild, Content Projection) gehören daher in den Kompaktkurs an Tag 4.

**Angular Grundkurs (Tag 1–3)**

| Tag | Themen | Material |
|---|---|---|
| 1 | Einordnung im Web-Stack (neu), TypeScript (gekürzt), CLI/Projekt, Standalone, Templates, Data Binding, Control Flow | Kapitel 0, Folien 1–110, `00`–`06` |
| 2 | Komponenten (Input/Output, Aufteilungskriterien als Theorie), Signals-Grundlagen, Services/DI, Lifecycle, Pipes | Kapitel 1 (Theorie), Folien 111–177, `07`–`18` |
| 3 | Observables/RxJS-Grundlagen, Routing, Services und externe Daten (HttpClient), Abschluss/Überleitung | Folien 178–212, 234–250, `19`–`21`, `23` (inkl. Ü24) |

**Zusätzlich im Kompaktkurs (Tag 4–5)** – Zeiten netto, ohne Pausen

| Tag | Block | Dauer | Material |
|---|---|---|---|
| 4 | Guards/Interceptors, Resource API, NgOptimizedImage, viewChild, Content Projection | ca. 150 min | Folien 253–267, `25`–`29` |
| 4 | Komponenten aufteilen, Wartbarkeit | ca. 60 min | Kapitel 1, Ü31 |
| 4 | Reaktivität und Datenfluss | ca. 120 min | Kapitel 2, Ü32 |
| 4 | Zustandsverwaltung (+ Vertiefung NgRx-Deck) | ca. 120 min | Kapitel 3, Ü33, Deck `State Management` |
| 5 | Testbarkeit und Tests | ca. 90 min | Kapitel 4, Ü34, Deck `Testing` |
| 5 | Performance | ca. 90 min | Kapitel 5, Ü35 |
| 5 | Sicherheit | ca. 75 min | Kapitel 6, Ü36 |
| 5 | KI-gestützte Entwicklung + Abschlussprojekt | ca. 120 min | Kapitel 7, Ü37, Ü38 |

Tag 4 ≈ 450 min, Tag 5 ≈ 375 min: Tag 4 ist knapp. Falls die Zeit nicht reicht, Ü27, Ü28 und Ü29 als Demo statt Übung durchführen oder das Abschlussprojekt kürzen.

Bei Zeitnot: Cypress, klassisches NgRx (Details) und Legacy-NgModule in den Anhang oder als Wahlthema.

---

## 6. Priorisierte To-do-Liste

1. **Neu erstellen:** Kapitel „KI-gestützte Entwicklung“ und „Sicherheit“ (komplett fehlend, in der Agenda ausdrücklich verlangt).
2. **Neu erstellen:** Kapitel „Performance und Laufzeitverhalten“ (Change Detection, `OnPush`/zoneless, `track`, Rendering, DevTools).
3. **Ergänzen:** `effect`, `linkedSignal`, Reaktivitäts-Stolperfallen; Folie „lokaler vs. abgeleiteter Zustand“.
4. **Ergänzen:** Entscheidungskriterien für Zustandsverwaltung, NgRx Signal Store mit Übung.
5. **Überarbeiten:** Testing-Deck auf Vitest als Hauptpfad, Verbindung Struktur ↔ Testbarkeit, „automatisch erzeugte Tests“.
6. **Ergänzen:** Einordnung im Web-Stack (Tag 1), Aufteilungskriterien für Komponenten, Wartbarkeit/Architektur-Folien.
7. **Kürzen:** TypeScript, Material, Cypress, Legacy, Forms (als Wahlthemen kennzeichnen).
8. **Aufräumen:** Übungsnummern, Repo-Struktur, README.

Wenn gewünscht, setze ich als nächsten Schritt einzelne Kapitel als Folienentwürfe (Markdown mit Notizen) oder als neue Übungsprojekte im Repo um.
