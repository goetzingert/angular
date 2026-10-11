# Übung 32: Reaktivitäts-Fallen finden

Basis: Ergebnis von Übung 31 (`31_komponenten_aufteilen`). In Teil C fügst du einen Patch mit **absichtlichen Fehlern** in `CustomerListComponent` ein und suchst sie.

## Aufgabe

**Teil A – Aufräumen**

1. Baue `customers` und `filteredCustomers()` in `CustomerListComponent` zu `computed` um (statt Pfeilfunktion bzw. Methode, die bei jeder Change Detection neu läuft).
2. Prüfe: Ein temporäres `console.log` im `computed` erscheint nur, wenn sich die Abhängigkeiten ändern (Liste geladen, Filter geändert), nicht bei jedem Mausklick.

**Teil B – Ein legitimer `effect`**

3. Sichere den Filtertext per `effect` in `localStorage` (Schlüssel `customerFilter`) und stelle ihn beim Start wieder her (Startwert des Filter-Signals). Prüfe: Seite neu laden, der Filter bleibt erhalten. `localStorage` kann fehlen oder gesperrt sein, fange das mit `try/catch` ab.

**Teil C – Fehlersuche (Patch einfügen)**

4. Füge den folgenden Patch in `CustomerListComponent` ein. Der erste Block gehört in die Klasse, der zweite ans Ende des Templates (nach `</ul>`).

```ts
// --- Klassenfelder ---
selectedName = signal('');
total = signal(0);

// --- Konstruktor (der effect aus Teil B steht dort schon, die zwei neuen kommen dazu) ---
constructor() {
  effect(() => this.selectedName.set(this.selectedCustomer()?.firstname ?? ''));   // (1)
  effect(() => this.total.set(this.filteredCustomers().length));                    // (3)
}

// --- Methode ---
addDemo() { this.customers().push(new Customer('Neu', 'Demo')); }                   // (2)
```

```html
<p>Treffer: {{ total() }} · Ausgewählt: {{ selectedName() || '-' }}</p>
<button (click)="addDemo()">Demo-Kunde hinzufügen</button>
```

5. Benenne je Zeile (1) bis (3): Was ist falsch? Gegen welche Regel aus Kapitel 2 wird verstoßen? Probiere (2) im Browser aus: Klicke den Button. Was passiert in der Liste, was im Array?
6. Behebe die Fehler: (1) und (3) mit `computed`, (2) mit einer neuen Referenz in einem lokalen Zustand (`signal` plus `update` mit Spread).

**Reflexion:** Welche dieser Fehler hätte ein Test gefunden, welche nur ein Review?

## Lernziele

- Du unterscheidest lokalen (`signal`) von abgeleitetem Zustand (`computed`) und erkennst, wann ein `effect` unnötig ist.
- Du setzt `effect` nur für Nebenwirkungen außerhalb von Angular ein (hier: Browser-Speicher).
- Du erkennst typische Fallen: Mutation statt neuer Referenz, `effect`, der ein Signal schreibt, Methoden im Template.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- (1) und (3): Ein `effect`, der nur ein anderes Signal setzt, ist abgeleiteter Zustand in Verkleidung. Lösung: `selectedName = computed(() => this.selectedCustomer()?.firstname ?? '')` und `total = computed(() => this.filteredCustomers().length)`. Vorteil: kein zusätzlicher Durchlauf, keine Ketten, nichts zum Aufräumen.
- (2): `customers()` liefert ein Array aus der Resource beziehungsweise aus einem `computed`. `push` verändert das Array, aber nicht die Referenz, deshalb merkt kein Signal etwas und die Liste bleibt unverändert. Der Zustand muss lokal gehalten werden (z. B. `demoCustomers = signal<Customer[]>([])`) und über `update(list => [...list, neuerKunde])` geändert werden. `customers` ist dann ein `computed`, das die Resource-Daten und die Demo-Kunden zusammensetzt.
- Der `effect` aus Teil B ist legitim: Er schreibt nach außen (Browser-Speicher) und in kein Signal. Er muss im Injection Context erzeugt werden, also im Konstruktor oder in einem Feldinitialisierer.
- Die Lösung dieses Ordners (`32_reaktivitaet`) enthält den korrigierten Stand ohne die Fehler.
