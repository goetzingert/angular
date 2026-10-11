# Kapitel 1 – Komponenten sinnvoll aufteilen und wartbar halten

**Tag:** 4 (nur Kompaktkurs, nach Ü25–29; Ü31 baut auf Ü29 auf) · **Dauer:** ca. 60 min inkl. Übung
**Agenda:** „Zerlegung von UI in eigenständige Einheiten“ / „Schnittstellen zwischen Komponenten sauber gestalten“ / „Kriterien für sinnvolle Aufteilung“ / „Wartbarkeit im Kontext von Architekturentscheidungen“ / „Merkmale stabiler und nachvollziehbarer Codebasen“
**Übung:** Ü31 `31_komponenten_aufteilen` (Basis: Ü29)

> **Grundkurs (3 Tage, Übungen bis ca. Ü24):** Die Agenda nennt auch dort „Verantwortlichkeiten, Wiederverwendbarkeit und Komposition“. Für den Grundkurs nur die Folien 1.1–1.5 und 1.10 als **reine Theorie** zeigen, am besten direkt nach Ü10 (Komponenten, Inputs/Outputs, `CustomerListComponent`) an Tag 2, und mit den Übungen 7–10 (Komponenten schachteln, Inputs, Events, Outputs) als Praxis verbinden. Ü31 entfällt dort.

---

### Folie 1.1 – Warum aufteilen?
- Eine Komponente sollte **einen Grund zur Änderung** haben.
- Zu groß: schwer zu verstehen, schwer zu testen, jede Änderung riskant.
- Zu fein: viele Dateien, viel Durchreichen von Daten, Überblick geht verloren.
- Ziel: so teilen, dass **Änderungen lokal bleiben**.

### Folie 1.2 – Kriterien für die Aufteilung
| Kriterium | Frage | Beispiel Invoice-App |
|---|---|---|
| Verantwortung | Macht die Komponente mehr als eine Sache? | Liste lädt Daten **und** filtert **und** zeigt an |
| Wiederverwendung | Taucht das Muster an mehreren Stellen auf? | `CardComponent` |
| Änderungsgrund | Ändern sich Teile aus unterschiedlichen Gründen? | Filterlogik vs. Listendarstellung |
| Lesbarkeit | Passt das Template auf einen Bildschirm? | Template > ca. 100 Zeilen |
| Testbarkeit | Braucht ein Test viel Setup für wenig Prüfung? | Komponente mit 5 Services |
| Rendering | Soll ein Teil selten/anders aktualisiert werden? | Kopfbereich vs. 1000 Listenzeilen |

> **Trainer:** Gemeinsam am Startprojekt Ü29 die `CustomerListComponent` durchgehen: Daten laden (`httpResource`), Filterzustand, Filterlogik, `viewChild`-Fokus, Auswahl, Darstellung. Das sind 5 Verantwortlichkeiten in einer Klasse.

### Folie 1.3 – Typische Fehlformen
- **God Component:** alles in einer Komponente (Daten, Logik, Layout).
- **Prop Drilling:** Daten werden durch 4 Ebenen durchgereicht, obwohl nur die letzte sie braucht → Service oder Content Projection.
- **Zu feine Teilung:** eine Komponente pro `<span>`.
- **Verdeckte Kopplung:** Kind greift auf Eltern per `inject(ParentComponent)` oder DOM zu.

### Folie 1.4 – Container und Darstellungskomponenten
| | Container („smart“) | Darstellung („dumb“) |
|---|---|---|
| Kennt Services/Daten laden | ja | nein |
| Eingänge | Route, Services | nur `input()` |
| Ausgänge | ruft Services auf | nur `output()` |
| Wiederverwendbar | selten | oft |
| Testen | Service mocken | nur Inputs setzen, Outputs prüfen |

```ts
// Darstellungskomponente: kennt weder Service noch Router
@Component({ selector: 'customer-filter', template: `
  <input [value]="value()" (input)="changed.emit($any($event.target).value)">
` })
export class CustomerFilterComponent {
  value = input('');
  changed = output<string>();
}
```

### Folie 1.5 – Schnittstellen sauber gestalten
- **`input.required<T>()`** für Pflichtdaten statt `undefined`-Prüfungen im Template.
- **Typen exportieren** (`Customer`), keine `any`.
- **Outputs benennen als Ereignis** (`customerSelected`, nicht `onClick`).
- **Daten nicht im Kind verändern:** Eingaben sind schreibgeschützt; Änderungen als Output melden (oder `model()` bewusst nutzen).
- **Kleine Schnittstelle:** lieber 3 klare Inputs als ein riesiges Konfig-Objekt.
- **Kein Zugriff auf Interna des Kindes** (DOM, private Felder); wenn nötig, öffentliche Methode oder `viewChild()` mit Bedacht.

### Folie 1.6 – Komposition statt Vererbung
- Wiederverwendung über **Komposition**: `<ng-content>` (Ü29), Direktiven, kleine Komponenten.
- Vererbung zwischen Komponenten vermeiden (versteckte Kopplung, Dekorator-Eigenheiten).
- Gemeinsames Verhalten: **Services** oder **Host-Direktiven** (`hostDirectives`).

### Folie 1.7 – Trennung von UI und Fachlogik
```
 Komponente (Darstellung, Eingaben)
        │ ruft auf
        ▼
 Service / Store (Fachlogik, Zustand)
        │ ruft auf
        ▼
 API-Client / HttpClient (Zugriff nach außen)
```
- Abhängigkeiten zeigen **nur nach unten**. Der Service kennt keine Komponente.
- Reine Berechnungen (z. B. „aktive Kunden“) als **pure Funktion** oder Pipe – ohne Angular testbar.
- Template enthält keine Fachregeln (`@if (c.discontinued && c.lastOrderDate > ...)` → `computed` oder Pipe).

### Folie 1.8 – Wartbarkeit: Merkmale einer stabilen Codebasis
- Namen sagen, **was** etwas ist (`CustomerListComponent`), nicht **wie** (`Helper2`).
- Dateistruktur nach **Features** (`customer/`, `auth/`, `shared/`), nicht nach Typ (alle Services in einem Ordner).
- TypeScript `strict`, kein `any` ohne Begründung.
- Kleine Funktionen/Komponenten, wenig Verschachtelung.
- Automatisierte Prüfung: ESLint, Prettier, Tests in der Pipeline.
- Entscheidungen sind nachvollziehbar: kurze Notiz (ADR) „Warum Store statt Service?“.

### Folie 1.9 – Struktur und Testbarkeit hängen zusammen
- Kleine Komponenten mit klaren Inputs/Outputs → Test in 5 Zeilen.
- Viele versteckte Abhängigkeiten (`inject` überall, globale Zustände) → Test braucht viel Mocking.
- Faustregel: **Wenn ein Test schwer zu schreiben ist, ist oft die Struktur das Problem.**
- Vertiefung in Kapitel 4 (Testbarkeit).

### Folie 1.10 – Checkliste „Soll ich aufteilen?“
1. Kann ich in einem Satz sagen, was die Komponente tut (ohne „und“)?
2. Gibt es Teile, die ich an anderer Stelle wiederverwenden würde?
3. Ändern sich Teile aus unterschiedlichen Gründen?
4. Ist die Schnittstelle zum Elternteil klein und typisiert?
5. Kann ich die Komponente isoliert testen?

---

## Übung 31 – Liste aufteilen (`31_komponenten_aufteilen`)

**Basis:** Ergebnis von Ü29 (`29_contentProjection/invoice-app`).
**Ziel:** `CustomerListComponent` in Container + Darstellung zerlegen.

1. Erzeuge `CustomerFilterComponent` (Eingabefeld + Löschen-Button). Schnittstelle: `value = input('')`, `changed = output<string>()`, `cleared = output<void>()`. Der Fokus-Mechanismus (`viewChild`) wandert mit.
2. Erzeuge `CustomerListItemComponent` mit `customer = input.required<Customer>()`, `selected = input(false)`, `chosen = output<Customer>()`.
3. `CustomerListComponent` behält nur: Daten laden, Filterzustand, Auswahlzustand.
4. Das Verhalten der App darf sich **nicht** ändern (Smoke-Test im Browser).
5. Reflexion (5 min): Welche Komponente ist jetzt trivial testbar? Welche Abhängigkeiten sind verschwunden?

**Lernziele:** Aufteilungskriterien anwenden, saubere Inputs/Outputs, Container-/Darstellungs-Trennung.

**Lösungshinweise:** Der `track`-Ausdruck bleibt vorerst unverändert (Thema in Kapitel 5). `routerLink` darf in `CustomerListItemComponent` bleiben, da es reine Darstellung/Navigation ist.
