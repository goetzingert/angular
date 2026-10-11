# Übung 33: CustomerStore einführen

Basis: Ergebnis von Übung 32 (`32_reaktivitaet`). Die Zustandslogik wandert aus der Komponente in einen Store.

## Aufgabe

1. Mache aus dem `CustomerService` eine reine API-Schicht: Das `ReplaySubject` und das automatische Laden im Konstruktor entfallen. Stattdessen liefert `getAll()` direkt das `Observable` des HTTP-Aufrufs (inklusive Umwandlung der Datumsfelder). Das Nachladen nach `insert()`/`update()` entfällt, weil die Liste beim Öffnen ohnehin neu geladen wird.
2. Erzeuge `customer/customer.store.ts` als Service mit Signals (`@Injectable({ providedIn: 'root' })`):
   - Zustand (privat und schreibbar): `customers`, `filter`, `selectedId`, dazu `loading` und `error`.
   - Nach außen nur lesbar über `asReadonly()`.
   - Abgeleitet (`computed`): `filtered`, `selected` und `total`.
   - Methoden („Aktionen“): `load()`, `setFilter()`, `select()`, `addDemo()`.
3. `CustomerListComponent` nutzt nur noch den Store: kein eigenes `httpResource`, keine eigene Filterlogik, kein eigenes Auswahl-Signal. Sie liest Signals und ruft Methoden auf. `load()` wird beim Öffnen der Liste aufgerufen.
4. Der `localStorage`-`effect` für den Filter aus Übung 32 wandert **in den Store**. Diskussion: Warum gehört die Nebenwirkung dorthin?
5. Prüfe im Browser, dass sich das Verhalten nicht geändert hat (Filter, Auswahl, Details, Speichern und zurück).
6. Reflexion: Anhand der Kriterien aus Kapitel 3 (Anzahl Konsumenten, Zustandsarten, Seiteneffekte, Teamgröße): War ein Store hier schon nötig? Begründe in drei Sätzen.
7. Optional (leistungsstarke Gruppen), nur Lesen/Skizzieren: Wie sähe derselbe Store mit `signalStore` aus `@ngrx/signals` aus? Vergleiche Zeilenzahl und Lesbarkeit (siehe unten).

## Lernziele

- Du trennst Zustand, Logik und Darstellung und wendest das Store-Muster (Service mit Signals) an.
- Du kapselst Zustand mit `asReadonly()` und änderst ihn nur über benannte Methoden.
- Du bewertest anhand von Kriterien, wann ein strukturierter Zustand sinnvoll ist.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- `selected = computed(() => customers().find(c => c.id === selectedId()))`: Gespeichert wird nur die ID, der ausgewählte Kunde wird abgeleitet („ableiten statt kopieren“).
- `load()` ist `async` und nutzt `firstValueFrom(customerService.getAll())` mit `try/catch/finally`, um `loading` und `error` zu pflegen.
- Ein `effect` im Konstruktor eines Services (`providedIn: 'root'`) ist erlaubt, weil dort ein Injection Context besteht.
- Die Liste ruft `store.load()` in `ngOnInit()` auf. Dadurch ist sie nach einem Speichern in den Details wieder aktuell.
- Hinweis zu Tests: Komponenten lesen `protected readonly store`; in Tests holst du den Store per `TestBed.inject(CustomerStore)`.

**Optional: Variante mit `@ngrx/signals`** (wird in dieser Lösung nicht installiert; Installation: `npm install @ngrx/signals`)

```ts
export const CustomerSignalStore = signalStore(
  { providedIn: 'root' },
  withState({ customers: [] as Customer[], filter: '', selectedId: undefined as string | undefined }),
  withComputed(({ customers, filter, selectedId }) => ({
    filtered: computed(() => customers().filter(c => c.firstname.toLowerCase().includes(filter().toLowerCase()))),
    selected: computed(() => customers().find(c => c.id === selectedId())),
  })),
  withMethods((store, service = inject(CustomerService)) => ({
    setFilter(filter: string) { patchState(store, { filter }); },
    select(selectedId: string | undefined) { patchState(store, { selectedId }); },
    async load() { patchState(store, { customers: await firstValueFrom(service.getAll()) }); },
  })),
);
```

Vergleich: Die Struktur ist dieselbe wie im handgeschriebenen Store (Zustand, Ableitungen, Methoden), aber standardisiert und erweiterbar (`withEntities`, `rxMethod`, eigene Features). Für diese kleine Liste lohnt sich die zusätzliche Abhängigkeit nicht; die Entscheidung hängt an den Kriterien aus Kapitel 3.
