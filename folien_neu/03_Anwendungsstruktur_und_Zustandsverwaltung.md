# Kapitel 3 – Anwendungsstruktur und Zustandsverwaltung

**Tag:** 4 (nach Kapitel 2, Ende des Tages) · **Dauer:** ca. 120 min inkl. Übung
**Agenda:** „Strukturierung von Anwendungen mit wachsender Komplexität“ / „Organisation und Trennung von Zuständigkeiten“ / „Strukturierte Modelle für die Zustandsverwaltung“ / „Trennung von Zustand, Logik und Darstellung“ / „Kriterien für den Wechsel zu strukturiertem Zustand“ / „Umgang mit wachsender Zustandskomplexität“
**Übung:** Ü33 `33_state_store` (Basis: Ü32)
**Verzahnung:** Das bestehende Deck `State Management_angular21.pptx` (NgRx-Technik) folgt **nach** diesen Folien als Vertiefung.

---

### Folie 3.1 – Wie Zustand wächst
```
Phase 1:  1 Komponente, 3 Felder                → signal() genügt
Phase 2:  3 Komponenten teilen sich Daten        → Service
Phase 3:  Daten + Filter + Auswahl + Laden/Fehler → Store-Muster
Phase 4:  viele Teams, Nachvollziehbarkeit nötig  → Redux-Muster (NgRx)
```
- Nicht jede App braucht Phase 4. **Zu früh** strukturieren kostet Boilerplate, **zu spät** kostet Umbau.

### Folie 3.2 – Anwendung strukturieren: Ordner und Zuständigkeiten
```
src/app/
  customer/              ← Feature
    customer-list/       ← Container
    customer-details/
    ui/                  ← Darstellungskomponenten
    customer.store.ts    ← Zustand + Fachlogik
    customer.api.ts      ← HTTP-Zugriff
    customer.model.ts
  auth/
  shared/                ← nur wirklich Allgemeines (Card, Pipes)
```
- Ein Feature kennt andere Features nur über definierte Schnittstellen (Service, Route).
- **Abhängigkeitsrichtung:** `shared` ← `feature`. Nie umgekehrt.

### Folie 3.3 – Drei Schichten: Zustand, Logik, Darstellung
| Schicht | Aufgabe | Wo |
|---|---|---|
| Zustand | Daten halten, ableiten | Signals im Store |
| Logik | Regeln, Befehle, Laden | Methoden im Store/Service |
| Darstellung | Anzeigen, Eingaben weitergeben | Komponenten/Templates |

- Komponenten **lesen** Signals und **rufen** Methoden auf. Sie entscheiden nicht, wie Zustand aussieht.

### Folie 3.4 – Stufe 1–2: Service mit Signals
```ts
@Injectable({ providedIn: 'root' })
export class CustomerStore {
  private readonly api = inject(CustomerApi);

  // privat schreibbar, öffentlich nur lesbar
  private readonly _customers = signal<Customer[]>([]);
  private readonly _filter = signal('');

  readonly customers = this._customers.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly filtered = computed(() => {
    const f = this._filter().toLowerCase();
    return this._customers().filter(c => c.firstname.toLowerCase().includes(f));
  });

  setFilter(text: string) { this._filter.set(text); }
  async load() { this._customers.set(await firstValueFrom(this.api.getAll())); }
}
```
- **Kapselung:** Außen nur `asReadonly()` und Methoden („Aktionen“).
- Besser als `ReplaySubject` im alten `CustomerService`: Zustand sofort lesbar, keine Subscriptions.

### Folie 3.5 – Asynchronen Zustand modellieren
```ts
type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'loaded'; data: T };
```
- Unmögliche Kombinationen (`loading` **und** `error`) sind nicht darstellbar.
- Alternative: `resource` liefert `value()`, `isLoading()`, `error()` bereits fertig (Ü26).
- Regel: **Server-Daten** (gecacht, geladen) von **UI-Zustand** (Dialog offen, Tab) trennen.

### Folie 3.6 – Wachsende Zustandskomplexität beherrschen
- **Normalisieren:** Entitäten nach `id` in einer Map halten, Listen enthalten nur IDs.
- **Ableiten statt kopieren:** „ausgewählter Kunde“ = `computed` aus `selectedId` + `customers`.
- **Änderungen als benannte Befehle:** `addCustomer`, `renameCustomer` statt überall `set()`.
- **Unveränderlich aktualisieren** (neue Referenzen), siehe Kapitel 2.
- **Zustand klein halten:** nur speichern, was nicht berechenbar ist.

### Folie 3.7 – Wann wechsle ich zu strukturiertem Zustand? (Kriterien)
| Kriterium | Service + Signals reicht | Store-Muster lohnt sich |
|---|---|---|
| Anzahl Konsumenten | 1–3 Komponenten | viele, verstreut über Features |
| Zustandsarten | 1–2 | mehrere zusammenhängende (Daten, Filter, Auswahl, Status) |
| Seiteneffekte | wenige | viele, abhängig voneinander |
| Nachvollziehbarkeit | egal | Änderungen müssen protokolliert/debugbar sein |
| Teamgröße | 1–3 Personen | mehrere Teams, einheitliche Muster nötig |
| Wiederverwendung | Einzelfall | gleiche Muster in vielen Features |
| Testaufwand | gering | gezielte Tests auf Zustandslogik |

> **Trainer:** Ergebnis im Kurs: „**Starte einfach (Service + Signals), strukturiere, wenn ein Kriterium schmerzt.**“

### Folie 3.8 – NgRx Signal Store: Muster als Bibliothek
```ts
export const CustomerStore = signalStore(
  { providedIn: 'root' },
  withState({ customers: [] as Customer[], filter: '' }),
  withComputed(({ customers, filter }) => ({
    filtered: computed(() => customers().filter(c =>
      c.firstname.toLowerCase().includes(filter().toLowerCase()))),
  })),
  withMethods((store, api = inject(CustomerApi)) => ({
    setFilter(filter: string) { patchState(store, { filter }); },
    async load() { patchState(store, { customers: await firstValueFrom(api.getAll()) }); },
  })),
);
```
- Gleiche Struktur wie Folie 3.4, aber **standardisiert** und erweiterbar (`withEntities`, `rxMethod`, Features).
- Komponenten: `store = inject(CustomerStore)` → `store.filtered()`, `store.setFilter(…)`.

### Folie 3.9 – Klassisches NgRx im Vergleich (Brücke zum Deck „State Management“)
| Baustein | Aufgabe | Äquivalent im Signal Store |
|---|---|---|
| State | Zustand | `withState` |
| Selector | Ableitung | `withComputed` |
| Action | Absicht | Methode |
| Reducer | Zustandsübergang | `patchState` in Methode |
| Effect | asynchrone Nebenwirkung | Methode / `rxMethod` |
- Klassisches NgRx: mehr Zeremonie, dafür **Action-Log, Time-Travel, strikte Trennung** – sinnvoll bei sehr großen Anwendungen und vielen Teams.

### Folie 3.10 – Typische Fehlentscheidungen
- **Alles in den Store:** UI-Details (Tab offen, Tooltip) gehören in die Komponente.
- **God Store:** ein Store für die ganze App. Besser pro Feature.
- **Doppelte Wahrheit:** Daten im Store **und** in der Komponente kopiert.
- **Server-Cache als Client-Zustand verwechseln:** Server-Daten haben Alter, Invalidierung, Fehler → `resource`/Caching-Strategie bedenken.
- **Framework-Entscheidung statt Problem:** erst Schmerz benennen, dann Werkzeug wählen.

### Folie 3.11 – Testbarkeit des Zustands
- Store = Klasse/Funktion mit klarer Schnittstelle → ohne UI testbar.
- Test: Methode aufrufen → Signal prüfen. Kein `fixture`, kein DOM.
- Vertiefung in Kapitel 4.

---

## Übung 33 – CustomerStore einführen (`33_state_store`)

**Basis:** Ergebnis von Ü32.
**Ziel:** Zustandslogik aus der Komponente in einen Store verlagern.

1. Erzeuge `customer/customer.store.ts` (Service mit Signals, wie Folie 3.4): Zustand `customers`, `filter`, `selectedId`; abgeleitet `filtered`, `selected`; Methoden `load()`, `setFilter()`, `select()`.
2. `CustomerListComponent` nutzt nur noch den Store (keine eigene Filterlogik, kein eigenes `httpResource`).
3. Der `localStorage`-Effect aus Ü32 wandert **in den Store** (Wo gehört die Nebenwirkung hin? Diskussion).
4. Zusatz (leistungsstarke Gruppen): zweite Variante mit `signalStore` aus `@ngrx/signals` und Vergleich Zeilenzahl/Lesbarkeit.
5. Reflexion: Anhand der Kriterien von Folie 3.7 – war der Store hier schon nötig? Begründung in 3 Sätzen.

**Lernziele:** Zustand/Logik/Darstellung trennen, Store-Muster anwenden, Wechselkriterien bewerten.

**Lösungshinweise:** `asReadonly()` verwenden; `selected = computed(() => customers().find(c => c.id === selectedId()))`; Abhängigkeit installieren: `npm install @ngrx/signals`.
