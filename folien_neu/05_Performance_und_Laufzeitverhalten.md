# Kapitel 5 – Performance und Laufzeitverhalten

**Tag:** 5 (Vormittag) · **Dauer:** ca. 90 min inkl. Übung
**Agenda:** „Einordnung von Performance im Anwendungskontext“ / „Auswirkungen von Struktur und Datenfluss auf die Laufzeit“ / „Vorbereitung auf skalierende Anwendungen“ / „Zusammenhang zwischen Zustandsstruktur und Rendering“ / „Typische Ursachen für Laufzeitprobleme erkennen“
**Übung:** Ü35 `35_performance` (Basis: Ü34)
**Anknüpfung:** Ü27 (`NgOptimizedImage`), Ü26 (Resource), `@defer` (Tag 2), Folie „SSR & Hydration“ im Hauptdeck.

---

### Folie 5.1 – Performance im Anwendungskontext
- Performance ist **kein Selbstzweck**, sondern Nutzererlebnis: „Fühlt sich die App schnell an?“
- Zwei Perspektiven:
  - **Ladezeit:** wie schnell ist etwas sichtbar/bedienbar? (Bundle-Größe, Netzwerk, Rendering)
  - **Laufzeit:** wie flüssig reagiert die App? (Change Detection, große Listen, Berechnungen)
- Regel Nr. 1: **Erst messen, dann optimieren.** Vorzeitige Optimierung macht Code komplizierter, ohne Wirkung.

### Folie 5.2 – Messen: Kennzahlen und Werkzeuge
| Kennzahl | Bedeutung |
|---|---|
| LCP (Largest Contentful Paint) | wann ist der Hauptinhalt sichtbar? |
| INP (Interaction to Next Paint) | wie schnell reagiert die App auf Eingaben? |
| CLS (Cumulative Layout Shift) | springt das Layout? |
| Bundle-Größe | wie viel muss geladen werden? |

| Werkzeug | Zweck |
|---|---|
| Chrome DevTools → Performance | Flamegraph, Long Tasks |
| Lighthouse | Ladeverhalten, Core Web Vitals |
| **Angular DevTools → Profiler** | welche Komponente wird wie oft geprüft? |
| `ng build --stats-json` + Analyzer | was steckt im Bundle? |
| Budgets in `angular.json` | Build schlägt fehl bei zu großem Bundle |

### Folie 5.3 – Wie Angular rendert (Kurzmodell)
- **Früher (Zone.js):** jedes Ereignis/Timer/HTTP → Angular prüft den **ganzen Komponentenbaum**.
- **Heute (zoneless + Signals):** ein Signal ändert sich → nur die **betroffenen Komponenten** werden als „dirty“ markiert und neu geprüft.
- `ChangeDetectionStrategy.OnPush`: Komponente wird nur geprüft bei geänderten Inputs, Ereignissen aus ihrem Template oder geänderten gelesenen Signals. Empfehlung für **alle** neuen Komponenten.
```ts
@Component({ changeDetection: ChangeDetectionStrategy.OnPush, … })
```
> **Trainer:** Das Startprojekt läuft bereits mit `provideZonelessChangeDetection()` (siehe `main.ts`). Hier erklären, was das für die Runtime bedeutet.

### Folie 5.4 – Struktur beeinflusst die Laufzeit
- Kleine Komponenten mit eigenen Signals → **kleine Aktualisierungsbereiche**.
- Eine große Komponente, die alles liest → bei jeder Änderung wird alles neu bewertet.
- Beispiel Invoice-App: Filtertext in `CustomerListComponent` → nur Liste darf neu gerendert werden, nicht der Kopfbereich.
- Das ist ein Grund mehr für die Aufteilung aus Kapitel 1.

### Folie 5.5 – Zustandsstruktur ↔ Rendering
```ts
// ❌ ein grobes Objekt-Signal: jede Änderung invalidiert alle Leser
state = signal({ customers: [], filter: '', selectedId: null });

// ✅ feine Signals + computed: nur betroffene Leser werden aktualisiert
customers  = signal<Customer[]>([]);
filter     = signal('');
selectedId = signal<string | null>(null);
selected   = computed(() => this.customers().find(c => c.id === this.selectedId()));
```
- Auch **Gleichheit** zählt: `computed` liefert dieselbe Referenz → nachfolgende Leser rechnen nicht neu.

### Folie 5.6 – `@for` und `track`
```html
@for (c of filteredCustomers(); track c)      <!-- ❌ Objektidentität (Startprojekt) -->
@for (c of filteredCustomers(); track c.id)   <!-- ✅ stabile ID -->
```
- Mit `track c` entstehen bei **neu geladenen** Objekten (z. B. nach `reloadData()`) **alle DOM-Elemente neu**; Zustand der Zeilen (Fokus, Animation) geht verloren.
- `track $index` nur, wenn die Liste statisch ist.
- Faustregel: **eine stabile, eindeutige ID** verwenden.

### Folie 5.7 – Berechnungen im Template
```html
{{ expensiveSum() }}              <!-- Methode: pro Change Detection -->
{{ total() }}                     <!-- computed: gecacht -->
{{ customer.lastOrderDate | currentActiveCustomers }}   <!-- reine Pipe: gecacht je Eingabe -->
```
- Pure Pipes und `computed` werden nur bei geänderten Eingaben neu berechnet.
- Vorsicht: **unreine Pipes** (`pure: false`) und `async`-Pipe in Schleifen.

### Folie 5.8 – Große Listen
| Maßnahme | Wirkung |
|---|---|
| `track` mit ID | weniger DOM-Neuaufbau |
| **Virtual Scrolling** (`@angular/cdk/scrolling`, `cdk-virtual-scroll-viewport`) | nur sichtbare Zeilen im DOM |
| **Paginierung / Server-seitiges Filtern** | weniger Daten übertragen |
| **Debounce** für Filtereingaben | weniger Neuberechnungen |
| leichte Zeilenkomponenten (`OnPush`) | günstigeres Prüfen |

```ts
debouncedFilter = toSignal(toObservable(this.filterText).pipe(debounceTime(250)), { initialValue: '' });
```

### Folie 5.9 – Ladezeit: nur laden, was gebraucht wird
- **Lazy Routes:** `loadComponent: () => import('./customer-details/…').then(m => m.CustomerDetailsComponent)`
- **`@defer`:** schwere Teile erst bei Bedarf (`on viewport`, `on interaction`, `on idle`, `when …`), mit `@placeholder` / `@loading`.
- **`NgOptimizedImage`** (Ü27): `priority` für das Hauptbild, `width/height` gegen Layout-Sprünge.
- **Bundle-Hygiene:** nur importieren, was man nutzt (kein `CommonModule` wenn Control Flow reicht), Tree-Shaking, Budgets.

### Folie 5.10 – Rendering-Strategien (Einordnung)
| Strategie | Idee | Wirkung |
|---|---|---|
| CSR | Browser baut alles | einfach, langsamer erster Inhalt |
| SSR + Hydration | Server liefert HTML, Browser „aktiviert“ | schneller erster Inhalt, SEO |
| Prerendering (SSG) | HTML beim Build | schnell für statische Seiten |
- Für interne Fachanwendungen oft CSR ausreichend; für öffentliche Seiten SSR prüfen.

### Folie 5.11 – Typische Ursachen für Laufzeitprobleme (Checkliste)
1. Methodenaufrufe im Template mit teurer Berechnung
2. `@for` ohne/mit ungeeignetem `track`
3. Sehr große Listen ohne Virtualisierung/Pagination
4. Grobes Objekt-Signal, das alles invalidiert
5. Zu viele Effects oder Effects, die Signals schreiben
6. Nicht abgemeldete Subscriptions, Timer, Event-Listener (Speicherlecks)
7. Zu große Bundles / zu viele Bibliotheken beim Start
8. Ungeeignete Bildgrößen/-formate
9. Zu häufige HTTP-Aufrufe (kein Debounce/Cache)

### Folie 5.12 – Vorbereitung auf Skalierung
- Messbare **Budgets** (Bundle, LCP) in CI.
- Performance-Tests bei Releases (Lighthouse CI).
- Architekturentscheidungen aus Kapitel 1–3 zahlen ein: kleine Komponenten, feines Signal-Modell, Lazy Loading.
- **Wiederholbar messen**, Ergebnisse dokumentieren.

---

## Übung 35 – „Langsame Liste“ (`35_performance`)

**Basis:** Ergebnis von Ü34.

1. **Last erzeugen:** Der Aufgabe liegt ein Hilfscode bei, der im Store 5000 Kunden erzeugt (z. B. `Array.from({length: 5000}, (_, i) => new Customer('Kunde ' + i, 'Test'))`), abschaltbar per Flag.
2. **Messen:** Chrome DevTools Performance (Eingabe im Filterfeld aufnehmen), Angular DevTools Profiler. Notiere: Dauer der Aktualisierung, Anzahl neu gerenderter Komponenten.
3. **Optimieren – ein Schritt nach dem anderen, jeweils neu messen:**
   - a) `track customer` → `track customer.id`
   - b) `OnPush` für `CustomerListItemComponent` und `CustomerListComponent`
   - c) Debounce für den Filter (250 ms)
   - d) Virtual Scrolling mit `cdk-virtual-scroll-viewport`
   - e) optional: `CustomerDetailsComponent` per Lazy Route (`loadComponent`)
4. **Ergebnis-Tabelle** füllen: Maßnahme | Messwert vorher | nachher | Fazit.
5. Diskussion: Welche Maßnahme brachte am meisten? Welche war unnötig?

**Lernziele:** Performance messen statt raten, Ursachen erkennen, Maßnahmen bewerten.

**Lösungshinweise:** Für Virtual Scrolling `@angular/cdk` installieren (`npm install @angular/cdk`); `itemSize` muss zur Zeilenhöhe passen; `*cdkVirtualFor` ersetzt hier das `@for`.
