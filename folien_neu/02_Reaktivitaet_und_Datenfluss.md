# Kapitel 2 – Reaktivität und Datenfluss

**Tag:** 4 (Vormittag) · **Dauer:** ca. 120 min inkl. Übung
**Agenda:** „Einführung in moderne reaktive Konzepte“ / „Steuerung von Zustandsänderungen und UI-Reaktionen“ / „Konsistente und nachvollziehbare Datenflüsse“ / „Lokaler vs. abgeleiteter Zustand“ / „Nebenwirkungen in reaktiven Systemen einordnen“ / „Typische Stolperfallen bei wachsender Reaktivität“
**Übung:** Ü32 `32_reaktivitaet` (Basis: Ü31)
**Voraussetzung:** `signal`, `computed`, `input`, `output` aus Tag 2; `toSignal` aus Ü19.

---

### Folie 2.1 – Das Grundmodell: Quelle → Ableitung → Wirkung
```
 Quelle (signal)  ──►  Ableitung (computed)  ──►  Wirkung (Template / effect)
  wird gesetzt          wird berechnet              wird ausgeführt
```
- **Quellen** halten Zustand, **Ableitungen** berechnen daraus Werte, **Wirkungen** greifen nach außen (UI, Speicher, Logging).
- Angular verfolgt automatisch, wer welches Signal liest (**Abhängigkeitsgraph**). Nichts muss manuell abonniert werden.

### Folie 2.2 – Landkarte der Reaktivitäts-Bausteine
| Baustein | Zweck | Schreibbar | Typischer Einsatz |
|---|---|---|---|
| `signal()` | Zustand halten | ja | Filtertext, Auswahl, Formularzustand |
| `computed()` | Wert ableiten | nein | gefilterte Liste, Summen, Flags |
| `linkedSignal()` | abgeleiteter, aber überschreibbarer Wert | ja | Auswahl, die bei Listenwechsel zurückgesetzt wird |
| `effect()` | Nebenwirkung | – | localStorage, Logging, Drittbibliothek |
| `resource()` / `httpResource()` | asynchron laden | nein | Daten vom Server |
| `toSignal()` / `toObservable()` | Brücke zu RxJS | – | Router-Events, bestehende Observables |

### Folie 2.3 – Lokaler vs. abgeleiteter Zustand
- **Lokaler (Quell-)Zustand:** kann der Benutzer oder ein Ereignis direkt ändern.
- **Abgeleiteter Zustand:** folgt zwingend aus anderem Zustand → **nicht speichern, sondern berechnen**.
- Regel: **Single Source of Truth.** Derselbe Fakt darf nur an einer Stelle gespeichert sein.

```ts
// ❌ doppelter Zustand: muss manuell synchron gehalten werden
customers = signal<Customer[]>([]);
filtered  = signal<Customer[]>([]);   // wird irgendwo "mitgepflegt"

// ✅ abgeleitet: kann nicht auseinanderlaufen
filtered = computed(() =>
  this.customers().filter(c => c.firstname.toLowerCase().includes(this.filterText().toLowerCase())));
```

### Folie 2.4 – Befund im Startprojekt (Ü31)
```ts
filteredCustomers() { … }          // normale Methode, läuft bei jeder Change Detection neu
customers = () => this.customerResource.value()?.data ?? [];   // Funktion, kein computed
```
- Funktioniert, aber: keine Zwischenspeicherung, schwer zu verfolgen, Abhängigkeiten nicht sichtbar.
- Umbau zu `computed` ist Teil von Ü32.

### Folie 2.5 – `computed` im Detail
- **Lazy:** berechnet erst beim ersten Lesen.
- **Memoized:** liefert gespeicherten Wert, solange sich Abhängigkeiten nicht ändern.
- **Dynamische Abhängigkeiten:** nur Signals, die beim letzten Lauf wirklich gelesen wurden, zählen.
- **Rein:** keine Nebenwirkungen, kein Schreiben auf Signals (Angular wirft einen Fehler).
- Gleichheit per `===`: Ergebnis gilt nur als geändert, wenn die Referenz eine andere ist.

### Folie 2.6 – `linkedSignal`: abgeleitet, aber änderbar
```ts
customers = input.required<Customer[]>();
// Auswahl springt auf das erste Element, sobald sich die Liste ändert,
// kann aber vom Benutzer überschrieben werden
selected = linkedSignal(() => this.customers()[0]);

onPick(c: Customer) { this.selected.set(c); }
```
- Ersetzt den Muster-Klassiker „`effect`, der ein Signal anhand eines anderen zurücksetzt“.

### Folie 2.7 – Nebenwirkungen und `effect()`
Eine **Nebenwirkung** verändert etwas **außerhalb** des Signal-Graphen.

**Gute Gründe für `effect`:**
- Zustand im `localStorage` / `sessionStorage` sichern
- Logging, Analytics
- Drittbibliothek (Diagramm, Karte, Canvas) mit Daten versorgen
- imperativer DOM-Zugriff, der nicht per Binding geht

```ts
constructor() {
  effect(() => {
    localStorage.setItem('customerFilter', this.filterText());
  });
}
```

### Folie 2.8 – Wann **kein** `effect`?
| Absicht | Besser |
|---|---|
| Wert aus anderen Signals berechnen | `computed` |
| Signal bei Quelländerung zurücksetzen | `linkedSignal` |
| Auf Klick/Eingabe reagieren | Event-Handler `(click)=…` |
| Daten laden, wenn sich `id` ändert | `resource` / `rxResource` |
| Beim Start einmal etwas tun | Konstruktor / `afterNextRender` |

- Faustregel: **„Wenn der effect ein Signal schreibt, gibt es fast immer eine bessere Lösung.“** Technisch erlaubt (seit v19), aber ein Warnsignal.

### Folie 2.9 – Wie `effect` ausgeführt wird
- Läuft **mindestens einmal**, danach bei jeder Änderung gelesener Signals.
- Läuft **asynchron** während der Change Detection – nicht sofort nach `set()`.
- Mehrere Änderungen in Folge → **ein** Lauf (Batching).
- Aufräumen über `onCleanup`:
```ts
effect((onCleanup) => {
  const id = setInterval(() => this.refresh(), this.pollMs());
  onCleanup(() => clearInterval(id));
});
```
- Muss im **Injection Context** erzeugt werden (Konstruktor/Feldinitialisierer) oder mit `injector`.
- `untracked(() => …)`: Lesen ohne Abhängigkeit.

### Folie 2.10 – Stolperfalle 1: Mutation statt neuer Referenz
```ts
list = signal<Customer[]>([]);

this.list().push(c);                       // ❌ Signal merkt nichts
this.list.update(l => [...l, c]);          // ✅ neue Referenz
this.list.update(l => l.map(x => x.id === c.id ? { ...x, ...changes } : x));
```
- Signals vergleichen per `===`. Gleiches Array = „keine Änderung“.
- Gilt auch für Objekte in Signals und `input()`-Werte.

### Folie 2.11 – Stolperfalle 2: Zyklen und Ketten
```ts
// ❌ effect schreibt in ein Signal, das ein anderer effect liest, der zurückschreibt …
effect(() => this.b.set(this.a() * 2));
effect(() => this.a.set(this.b() + 1));   // Endlosschleife / schwer nachvollziehbar
```
- Ketten aus `effect → set → effect` sind kaum zu debuggen. Stattdessen **eine** Quelle und `computed`.
- `NG0600`: Schreiben auf Signals innerhalb von `computed` ist verboten.

### Folie 2.12 – Stolperfalle 3: Methoden und Getter im Template
```html
{{ expensiveSum() }}       <!-- normale Methode: bei jeder Change Detection -->
{{ total() }}              <!-- computed: nur bei geänderten Abhängigkeiten -->
```
- Ausnahme: reine, billige Aufrufe. Im Zweifel `computed` oder reine Pipe.

### Folie 2.13 – Stolperfalle 4: Brücke zu RxJS
- `toSignal(obs$)` ohne `initialValue` liefert `T | undefined` → im Template behandeln.
- `toSignal` abonniert automatisch und räumt auf (Injection Context nötig).
- Fehler im Observable werden beim Lesen des Signals **erneut geworfen** → `catchError` vorher.
- Für **Zeit und Ereignisströme** (debounce, switchMap, Retry) bleibt RxJS die bessere Wahl; für **Zustand** Signals.

```ts
filter$ = toObservable(this.filterText).pipe(debounceTime(300), distinctUntilChanged());
debounced = toSignal(this.filter$, { initialValue: '' });
```

### Folie 2.14 – Stolperfalle 5: zu grobe Signals
```ts
state = signal({ customers: [], filter: '', selectedId: null, loading: false });
// jede Änderung an irgendeinem Feld invalidiert ALLE, die state() lesen
```
- Besser: mehrere kleine Signals + `computed` für Ausschnitte.
- Auswirkungen auf Rendering: siehe Kapitel 5.

### Folie 2.15 – Nachvollziehbare Datenflüsse
```
   Eltern ──input()──► Kind        (Daten nach unten)
   Eltern ◄──output()── Kind       (Ereignisse nach oben)
   Komponente ──► Service/Store ──► Signal ──► alle Leser aktualisieren
```
- Regeln: eine Richtung, ein Besitzer pro Zustand, Änderungen nur über benannte Methoden („Aktionen“).
- Debugging: Angular DevTools zeigt Signal-Graph und Werte; im Zweifel `effect(() => console.log(x()))` temporär.

### Folie 2.16 – Entscheidungsbaum: Welcher Baustein?
1. Kommt der Wert vom Benutzer oder einem Ereignis? → `signal`
2. Folgt er aus anderen Werten? → `computed` (überschreibbar: `linkedSignal`)
3. Kommt er asynchron vom Server? → `resource`/`httpResource`
4. Muss etwas **außerhalb** von Angular passieren? → `effect`
5. Zeit/Ereignisströme (Debounce, Cancel, Retry)? → RxJS, am Rand `toSignal`

---

## Übung 32 – Reaktivitäts-Fallen finden (`32_reaktivitaet`)

**Basis:** Ergebnis von Ü31. Die Aufgabe liefert einen Patch (Codeausschnitt, wird in `CustomerListComponent` eingefügt) mit absichtlichen Fehlern.

**Teil A – Aufräumen:**
1. `filteredCustomers()` und `customers` in `computed` umbauen.
2. Verifizieren: ein `console.log` im `computed` erscheint nur bei geänderten Abhängigkeiten.

**Teil B – Legitimer `effect`:**
3. Filtertext per `effect` in `localStorage` sichern und beim Start wiederherstellen.

**Teil C – Fehlersuche (Patch einfügen):**
```ts
selectedName = signal('');
effect(() => this.selectedName.set(this.selectedCustomer()?.firstname ?? ''));   // (1)
addDemo() { this.customers().push(new Customer('Neu', 'Demo')); }                 // (2)
total = signal(0);
effect(() => this.total.set(this.filteredCustomers().length));                    // (3)
```
4. Je Zeile benennen: Was ist falsch? Welche Regel (Folie) wird verletzt?
5. Beheben: (1) → `computed`, (2) → neue Referenz im Zustand, (3) → `computed`.

**Reflexion:** Welche Fehler hätte ein Test gefunden? Welche nur ein Review?

**Lernziele:** lokaler vs. abgeleiteter Zustand, sinnvolle vs. unnötige Effects, typische Fallen erkennen.

**Lösungshinweise:** (2) funktioniert nicht, weil `customers` aus einer Resource kommt – Zustand muss lokal gehalten werden (Kapitel 3). Hier reicht die Erklärung, warum `push` nichts auslöst.
