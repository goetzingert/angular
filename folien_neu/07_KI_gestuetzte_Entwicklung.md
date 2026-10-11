# Kapitel 7 – KI-gestützte Entwicklung im Kontext moderner Angular-Anwendungen

**Tag:** 5 (Nachmittag) · **Dauer:** ca. 120 min inkl. Übungen und Abschlussprojekt
**Agenda:** „Einordnung von KI-Unterstützung im Entwicklungsprozess“ / „Zusammenarbeit zwischen Entwickler und KI“ / „Automatisierte Vorschläge bewerten und kontrolliert einsetzen“ / „Zusammenarbeit mit KI über mehrere Runden hinweg“ / „Grenzen und Fehlannahmen der KI erkennen“
**Übungen:** Ü37 `37_ki_review` und Ü38 `38_abschluss` (Basis: Ü36)

> **Hinweis für Trainer:** Werkzeuge und Funktionen ändern sich schnell. Die Folien beschreiben **Arbeitsweisen**, nicht Produkte. Vor dem Kurs prüfen, welche Werkzeuge die Teilnehmenden einsetzen dürfen (Firmenrichtlinien, Datenschutz) und die Übungen entsprechend anpassen.

---

### Folie 7.1 – Einordnung: Wofür KI in der Entwicklung?
| Einsatz | Eignung |
|---|---|
| Boilerplate, Gerüste, Umbenennungen | sehr gut |
| Erklären von fremdem Code, Fehlermeldungen | gut |
| Tests vorschlagen, Randfälle brainstormen | gut, mit Review |
| Refactoring in kleinen Schritten | gut, mit Tests |
| Architekturentscheidungen, Fachlogik, Sicherheit | **nur als Diskussionspartner** |
| Blindes Übernehmen großer Änderungen | riskant |
- KI ist ein **schneller Assistent ohne Verantwortung**. Die Verantwortung für Code bleibt beim Entwickler.

### Folie 7.2 – Formen der Unterstützung
- **Chat:** Fragen stellen, Code erklären lassen.
- **Inline-Vorschläge in der IDE:** Autovervollständigung auf Zeilen-/Blockebene.
- **Agentische Werkzeuge:** lesen das Projekt, ändern mehrere Dateien, führen Befehle/Tests aus.
- Mit steigender Autonomie steigt der **Prüfaufwand** – und der mögliche Schaden.

### Folie 7.3 – Zusammenarbeit: Kontext ist alles
Gute Ergebnisse brauchen guten Kontext:
- **Aufgabe klar und klein** formulieren („Erstelle eine Darstellungskomponente `CustomerFilter` mit `input` und `output`“) statt „baue die App um“.
- **Projektregeln mitgeben:** eine Datei im Repo (je nach Werkzeug z. B. `CLAUDE.md`, `AGENTS.md`, Rules-Datei) mit Stil und Verboten.
- **Beispiele zeigen:** „Schau dir `CustomerListComponent` an und mache es analog.“
- **Aktuelle Angular-Konventionen angeben:** Angular stellt dafür offizielle Hinweise bereit (Doku-Seiten für KI-gestützte Entwicklung, `llms.txt`, MCP-Server der Angular CLI) – aktuelle Quellen auf angular.dev prüfen.

### Folie 7.4 – Beispiel: Projektregeln für Angular (Auszug)
```markdown
# Projektregeln
- Angular 21, TypeScript strict, zoneless, OnPush.
- Standalone-Komponenten (kein NgModule), `inject()` statt Konstruktor-Injection.
- Control Flow `@if`/`@for` (mit `track` auf ID), keine `*ngIf`/`*ngFor`.
- `input()`/`output()`/`model()`, keine Dekoratoren `@Input`/`@Output`.
- Zustand: `signal`/`computed`; `effect` nur für Nebenwirkungen außerhalb von Angular.
- Keine `any`, kein `bypassSecurityTrust*` ohne Rückfrage.
- Tests mit Vitest; neue Logik immer mit Tests.
```

### Folie 7.5 – Vorschläge bewerten: Review-Checkliste
1. **Läuft es?** Build, Lint, Tests.
2. **Passt es zur Architektur?** Abhängigkeitsrichtung, Feature-Struktur, keine neue Parallelwelt.
3. **Ist es modern?** Keine veralteten APIs (`*ngIf`, `@Input`, NgModule), keine erfundenen Methoden.
4. **Ist es sicher?** `innerHTML`, `bypassSecurityTrust*`, Tokens, Logging (Kapitel 6).
5. **Ist es reaktiv korrekt?** Effects missbraucht? Mutationen? (Kapitel 2)
6. **Ist es getestet?** Tests sinnvoll oder nur `toBeTruthy`? (Kapitel 4)
7. **Verstehe ich es?** Was ich nicht erklären kann, committe ich nicht.

### Folie 7.6 – Typische KI-Fehler bei Angular
| Fehlerbild | Beispiel |
|---|---|
| Veraltete Muster | `*ngFor`, `@Input()`, `constructor(private http: HttpClient)`, NgModule |
| Erfundene/falsche APIs | Methoden oder Optionen, die es nicht gibt |
| `effect` für alles | Zustand synchronisieren statt `computed` |
| `any` und Typ-Casts | lässt Fehler verschwinden statt zu lösen |
| Unnötige Komplexität | zusätzliche Abstraktionen, Wrapper, Utility-Klassen |
| Sicherheitsblindheit | `innerHTML`, Tokens in `localStorage`, nicht validierte Weiterleitungen |
| Tests, die nichts prüfen | `toBeTruthy`, Mock-Spiegelung |
| Stilbruch | andere Namens-/Ordnerkonventionen |

### Folie 7.7 – Mehrrunden-Zusammenarbeit
```
 1. Ziel + Kontext  →  2. Plan prüfen lassen  →  3. kleiner Schritt umsetzen
        ▲                                                  │
        └────── 6. nächste Runde ◄── 5. Korrektur ◄── 4. Review + Tests
```
- **Erst Plan, dann Code:** Plan als Liste von Schritten besprechen, bevor Dateien geändert werden.
- **Kleine, überprüfbare Schritte** (ein Commit pro Schritt).
- **Ergebnisse zurückspiegeln:** Fehlermeldungen, Testausgabe, Review-Befunde konkret an die KI geben.
- **Kontext pflegen:** Bei langen Sitzungen vergisst/verwischt die KI frühere Vorgaben – Regeln wiederholen oder neue Sitzung mit Zusammenfassung starten.
- **Nicht vom Weg abbringen lassen:** Bei Abweichung vom Plan stoppen und korrigieren.

### Folie 7.8 – Gute Prompts (Muster)
```
Kontext:   Angular 21 App, Feature `customer`, siehe customer-list.component.ts
Aufgabe:   Extrahiere die Filter-UI in eine Darstellungskomponente `CustomerFilterComponent`
Vorgaben:  input()/output(), OnPush, keine Services, kein neues Paket
Abnahme:   Verhalten unverändert; Test für Output vorhanden; `ng build` grün
Format:    Zeige zuerst den Plan, dann die Änderungen als Diff
```
- Also: **Kontext – Aufgabe – Vorgaben – Abnahmekriterien – Format.**

### Folie 7.9 – Grenzen und Fehlannahmen
| Fehlannahme | Realität |
|---|---|
| „Die KI weiß, wie unser Projekt aussieht.“ | Nur was im Kontext steht. |
| „Wenn sie selbstsicher klingt, stimmt es.“ | Klingt immer überzeugend, auch bei Unsinn (Halluzination). |
| „Es kompiliert, also ist es richtig.“ | Falsches Verhalten, Sicherheitslücken, Performance bleiben möglich. |
| „Tests von der KI = Qualitätsnachweis.“ | Nur wenn sie Verhalten wirklich prüfen. |
| „Die KI kennt die aktuelle Angular-Version.“ | Trainingsstand kann veraltet sein → Doku prüfen. |
| „Die KI spart mir das Lernen.“ | Ohne Wissen kann ich Ergebnisse nicht beurteilen. |

### Folie 7.10 – Datenschutz, Lizenzen, Verantwortung
- **Keine Geheimnisse, Zugangsdaten, Kundendaten** in Prompts oder Kontextdateien.
- **Firmenrichtlinien** beachten: erlaubte Werkzeuge, Datenablage, Nachweispflichten.
- **Lizenzen:** Herkunft generierten Codes kann unklar sein; bei längeren Übernahmen Richtlinien/Prüfung beachten.
- **Kennzeichnung und Nachvollziehbarkeit:** Review-Verantwortlicher ist der committende Entwickler.
- **Abhängigkeiten:** vorgeschlagene Pakete prüfen (Existenz, Pflege, Sicherheit) – gelegentlich werden Paketnamen erfunden.

### Folie 7.11 – Was bleibt Entwicklerkompetenz?
- Anforderungen verstehen und präzisieren
- Architektur und Abwägungen (Kapitel 1–3)
- Code **lesen und beurteilen**
- Testen, Messen, Absichern (Kapitel 4–6)
- Verantwortung im Team und gegenüber Nutzern

---

## Übung 37 – KI-Ergebnis reviewen (`37_ki_review`)

**Basis:** Ergebnis von Ü36. Wahlweise mit eigenem KI-Werkzeug oder mit dem **vorbereiteten Beispielergebnis** (Datei `ki-vorschlag.md` in der Aufgabe, falls kein Werkzeug erlaubt ist).

**Auftrag an die KI (oder Material):** „Ergänze eine Funktion ‚Kunden als CSV exportieren‘ und eine Komponente `CustomerExportButton`.“

1. Ergebnis lesen und mit der Checkliste (Folie 7.5) prüfen. Mindestens 5 Befunde dokumentieren.
2. Im vorbereiteten Beispiel sind absichtlich enthalten: `*ngIf`, `any`, ein `effect`, der ein Signal schreibt, ein `innerHTML`, ein Test mit `toBeTruthy`.
3. Befunde in einem **zweiten Prompt** zurückspielen („Behebe: …“) und das Ergebnis erneut prüfen (Mehrrunden-Prozess).
4. Auswertung im Plenum: Welche Fehler hat die KI nicht selbst erkannt? Welche Fehler waren neu?

**Lernziele:** Vorschläge kontrolliert bewerten, Rückkopplung über mehrere Runden, Grenzen erkennen.

---

## Übung 38 – Abschlussprojekt (`38_abschluss`)

**Basis:** Ergebnis von Ü37.
**Auftrag:** Neues Feature „**Kunden-Dashboard**“: Seite mit Kennzahlen (Anzahl Kunden, aktive Kunden der letzten 7 Tage, Kunden pro Stadt), Route `/dashboard`.

Vorgehen in Kleingruppen, **mit KI-Unterstützung nach Wahl**:
1. Plan schreiben (5 Schritte) und im Team abstimmen.
2. Umsetzen in kleinen Schritten, je Schritt ein Commit.
3. Anforderungen: `computed` für Kennzahlen (Kapitel 2), Daten über den `CustomerStore` (Kapitel 3), lazy geladene Route (Kapitel 5), keine unsicheren Muster (Kapitel 6), mindestens 3 sinnvolle Tests (Kapitel 4).
4. Selbst-Review mit den Checklisten (Kapitel 1, 4, 6, 7). Kurzvorstellung (5 min je Gruppe): Was hat die KI gut gemacht, wo musste korrigiert werden?

**Bewertungskriterien:** Architektur, Reaktivität, Tests, Sicherheit, Nachvollziehbarkeit des Vorgehens.
