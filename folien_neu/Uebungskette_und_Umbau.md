# Übungskette: Ist-Analyse, neue Übungen 31–38 und Umbau bei „Forms raus“

Grundlage: Analyse der Ordner `04_…` bis `30_…` (jeweils vollständiger `invoice-app`-Snapshot **mit der Lösung** der Übung).

## 1. Ist-Zustand der Kette

| Bereich | Befund |
|---|---|
| `04`–`12` | aufeinander aufbauend (Komponenten, Direktiven, Inputs/Outputs, Auswahl) |
| `13_templateForms` | **Sackgasse:** `ngModel` aus Ü13 ist in `14_service` nicht mehr enthalten (Details-Komponente wird dort ohne Formular neu aufgebaut) |
| `14`–`21` | aufeinander aufbauend (Service, DI, Lifecycle, Pipes, Observables, Routing). `customer-details` ist hier minimal (nur Anzeige) |
| **`22_forms`** | **führt Reactive Forms ein** (`customer-details.component.ts/.html/.spec.ts`, `customer.service.ts`) |
| `23`, `25`–`29` | bauen auf `22` auf; **alle enthalten dasselbe Reactive Form** in `customer-details` (je 1 Datei mit `ReactiveFormsModule`/`FormBuilder`, plus Spec) |
| `24` | fehlt als Ordner (Ü24 ist als „Teil 2“ in `23_communication` enthalten) |
| `30_modules_legacy` | eigene Basis (`trainings`, NgModule), **unabhängig** von Forms in 22–29 (hat aber eigenes Formular in `training-details`) |

Fazit: **Forms betreffen genau 7 Snapshots (22, 23, 25, 26, 27, 28, 29)**, nicht die ganze Kette. Ü13 ist isoliert; Ü30 ist eigenständig.

Wichtige Wechselwirkung: In 22–25 synchronisiert ein `effect` das Formular (`patchValue`), in 26–29 steht dort `rxResource` + `effect`. Dieser `effect` ist ein **echtes Lehrbeispiel** für Kapitel 2 („Brücke zu einer nicht-signalbasierten API“). Fällt das Reactive Form weg, entfällt dieses Beispiel; Kapitel 2 arbeitet deshalb bewusst mit `CustomerListComponent` (Filtertext → `localStorage`) und ist **unabhängig von Forms**.

## 2. Neue Übungen 31–38 (aufbauend ab Snapshot 29)

Die neuen Kapitel hängen **hinter** `29` an, damit keine bestehenden Ordner umnummeriert werden müssen. Jede Übung startet vom Ergebnis der vorigen (gleiche Konvention wie bisher).

| Ü | Ordner | Kapitel | Basis | Änderungen im Projekt | Forms-abhängig? |
|---|---|---|---|---|---|
| 31 | `31_komponenten_aufteilen` | 1 | 29 | `CustomerFilterComponent`, `CustomerListItemComponent` | nein |
| 32 | `32_reaktivitaet` | 2 | 31 | `computed` statt Methoden, `effect` → `localStorage`, Fehlersuche | nein |
| 33 | `33_state_store` | 3 | 32 | `customer.store.ts` (Service mit Signals, optional Signal Store) | nein |
| 34 | `34_tests` | 4 | 33 | Vitest-Specs für Store und Darstellungskomponente, Review einer „generierten“ Spec | nein |
| 35 | `35_performance` | 5 | 34 | 5000 Testkunden, `track` per ID, `OnPush`, Debounce, Virtual Scrolling, Lazy Route | nein |
| 36 | `36_sicherheit` | 6 | 35 | Feld `note`, `innerHTML`-Varianten, `returnUrl`-Allowlist | nein (nur Anzeige im Detail) |
| 37 | `37_ki_review` | 7 | 36 | CSV-Export als zu reviewender Vorschlag | nein |
| 38 | `38_abschluss` | 7 | 37 | `/dashboard`-Feature | nein |

Voraussetzungen, die einmalig zu klären sind:
- **Test-Runner:** Die Snapshots enthalten `jasmine-core`/`karma` in `package.json`. Für Ü34 muss auf Vitest umgestellt werden (Angular 21: `ng test` mit Vitest-Builder) oder Ü34 nutzt zunächst die vorhandene Konfiguration und das Kapitel zeigt die Vitest-Syntax. **Entscheidung nötig.**
- **Pakete:** `@ngrx/signals` (Ü33, optional), `@angular/cdk` (Ü35).
- **Bekannte Befunde im Startprojekt 29**, die absichtlich als Lehrmaterial dienen: `track customer` (Ü35), `filteredCustomers()` als Methode statt `computed` (Ü32), `CommonModule` in `customer-details` (Ü35 Bundle-Hygiene).

## 3. „Forms raus“ – Optionen

Ausgangslage: Das Hauptdeck behandelt Forms auf den Folien 213–226 und in Ü22. Grundkurs-Agenda und Kompakt-Agenda erwähnen Formulare **nicht**. Wenn Forms Wahlthema wird, bleibt die Frage, **wie die Kunden-Bearbeitung in 22–29 funktioniert**.

### Option A (empfohlen): Reactive Forms durch einfaches Template-Driven Form ersetzen
- **Idee:** Ü22 wird zu „Kunde bearbeiten und speichern“ mit `FormsModule`/`ngModel` (bereits in Ü13 und Folie 100 eingeführt). Validierung nur minimal (`required`, `pattern` als HTML-Attribute) oder entfällt.
- **Umbau:** In den **7 Snapshots 22, 23, 25, 26, 27, 28, 29** je `customer-details.component.ts`, `.html` und `.spec.ts` anpassen; Aufgaben-Texte (`Aufgabe.md`) von Ü22 und Ü23 anpassen (Ü23 spricht vom „Formular“).
- **Design:** Lokale, bearbeitbare Kopie über `linkedSignal(() => ({ ...this.customer() }))`; Eingabefelder per `[ngModel]`/`(ngModelChange)`. Das ist ein sinnvolles, kleines Praxisbeispiel für `linkedSignal` (Kapitel 2) und ersetzt den `patchValue`-`effect`.
- **Aufwand:** mittel (7 × 3 Dateien, mechanisch gleich; danach je Snapshot `ng build` und Test-Lauf).
- **Vorteil:** durchgängig konsistent, weniger neue Konzepte vor Tag 3, mehr Zeit für Agenda-Themen.

### Option B (geringster Aufwand): Reactive Form bleibt als „vorgegebener Code“
- Folien 213–226 wandern in Anhang/Wahlblock; Ü22 wird „optional“.
- Snapshots 22–29 bleiben unverändert; `Aufgabe.md` von Ü23 erklärt: „Das Formular ist vorgegeben.“
- **Nachteil:** Teilnehmende arbeiten in späteren Übungen mit APIs (`FormBuilder`, `formControlName`), die im Kurs nicht erklärt wurden.

### Option C: Forms komplett entfernen
- Details-Seite ohne Bearbeitung; Ü23 „Update“ entfällt oder wird durch einen einfachen Button (z. B. „Als inaktiv markieren“) ersetzt.
- Aufwand wie A, aber Verlust des durchgängigen Edit-Szenarios, das für Interceptor (Ü25) und Sicherheit (Ü36) als Anknüpfung dient. Nicht empfohlen.

### Entscheidungshilfe
| Frage | A | B | C |
|---|---|---|---|
| Aufwand für Umbau | mittel | gering | mittel |
| Konsistenz der Übungen | hoch | mittel | hoch |
| Neue Konzepte für Teilnehmende | wenige | viele (unerklärt) | keine |
| Edit-Szenario bleibt | ja | ja | nein |
| Passt zur Agenda | ja | bedingt | ja |

## 4. Umbau-Checkliste für Option A (wenn freigegeben)

1. **Referenz bauen:** `22_forms` nach Option A umbauen, `ng build` und Tests grün.
2. **Mechanisch übertragen** auf 23, 25, 26, 27, 28, 29 (dieselbe Änderung an Details-Komponente; in 26–29 mit Resource/`CardComponent`/`NgOptimizedImage`).
3. `Aufgabe.md` anpassen: Ü22 (Titel, Aufgaben, Lernziele), Ü23 (Verweise auf „Formular“), ggf. Ü25–29 (Texte, die das Formular erwähnen).
4. Folien: 213–226 in Anhang/Wahlblock; Folie 100/102/144 (ngModel, Ü5/Ü13) bleiben im Hauptpfad. Folie 221 („2-fache Validierung“) sinngemäß nach Kapitel 6 übernehmen.
5. Specs (`*.spec.ts`) an die neue Komponente anpassen.
6. Optional: Reactive-Forms-Material als **eigener Wahlordner** `Z1_reactive_forms` sichern (Kopie von heutigem `22_forms`), damit es nicht verloren geht.
7. Danach prüfen: Alle Ordner 22–38 starten mit `ng serve --proxy-config dev.proxy.json` (Backend aus `server/`).

## 5. Empfohlene Reihenfolge der Arbeit
1. Entscheidung Forms (A/B/C) und Test-Runner (Karma behalten vs. Vitest).
2. Umbau 22–29 (falls A/C), Referenz zuerst.
3. Neue Übungen 31–38 als Projekte aufsetzen (jeweils Ordner mit `Aufgabe.md` + Lösungs-Snapshot, wie bisher).
4. Folien aus den Texten in `folien_neu/` ins PowerPoint-Deck übernehmen (Chapter → Abschnitt, siehe Tabelle in `README.md`).
