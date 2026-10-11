# Übung 35: „Langsame Liste“

**Zeitrichtwert:** ca. 45 Minuten

Basis: Ergebnis von Übung 34 (`34_tests`). Du erzeugst künstlich Last, misst und optimierst Schritt für Schritt. Dafür brauchst du das Paket `@angular/cdk` (`npm install @angular/cdk`, in dieser Lösung bereits in `package.json` eingetragen).

## Aufgabe

1. **Last erzeugen.** Ergänze im `CustomerStore` den folgenden Lastgenerator (abschaltbar über den Wert `0`) und rufe ihn in `load()` nach dem Laden auf:

   ```ts
   export const LOAD_TEST_SIZE = new InjectionToken<number>('LOAD_TEST_SIZE', {
     providedIn: 'root',
     factory: () => 5000          // 0 = Lastgenerator aus
   });

   // im Store
   private readonly loadTestSize = inject(LOAD_TEST_SIZE);

   private createLoadTestCustomers(): Customer[] {
     const cities = ['Springfield', 'Shelbyville', 'Capital City', 'Ogdenville', 'North Haverbrook'];
     const day = 1000 * 60 * 60 * 24;
     return Array.from({ length: this.loadTestSize }, (_, i) => new Customer(
       'Kunde ' + i, 'Test', undefined, undefined, cities[i % cities.length], undefined,
       i % 10 === 0, new Date(Date.now() - (i % 30) * day)
     ));
   }

   // in load():
   const loaded = await firstValueFrom(this.customerService.getAll());
   this._customers.set([...loaded, ...this.createLoadTestCustomers()]);
   ```

   Tests, die genaue Listen erwarten, stellen den Generator per `providers` ab: `{ provide: LOAD_TEST_SIZE, useValue: 0 }`.
2. **Messen.** Nimm in den Chrome DevTools (Performance) auf, wie sich eine Eingabe im Filterfeld auswirkt, und sieh dir den Profiler der Angular DevTools an. Notiere Dauer der Aktualisierung und Anzahl der DOM-Knoten bzw. neu gerenderter Komponenten.
3. **Optimieren.** Immer ein Schritt, danach jeweils neu messen:
   - a) `track customer` → `track customer.id`
   - b) `OnPush` für `CustomerListItemComponent` und `CustomerListComponent`
   - c) Debounce für den Filter (250 ms)
   - d) Virtual Scrolling mit `cdk-virtual-scroll-viewport`
   - e) Optional: `CustomerDetailsComponent` per Lazy Route (`loadComponent`)
4. **Ergebnis-Tabelle füllen** (Vorlage unten).
5. Diskussion: Welche Maßnahme brachte am meisten? Welche war unnötig oder hat sich nur im Zusammenspiel gelohnt?

**Vorlage für die Ergebnis-Tabelle**

| Maßnahme | Messwert vorher | Messwert nachher | Fazit |
|---|---|---|---|
| Ausgangslage (5000 Kunden) | – | (Dauer Eingabe, DOM-Knoten) | |
| a) `track customer.id` | | | |
| b) `OnPush` | | | |
| c) Debounce 250 ms | | | |
| d) Virtual Scrolling | | | |
| e) Lazy Route (Größe Start-Bundle) | | | |

## Lernziele

- Du misst Performance, statt zu raten, und dokumentierst die Ergebnisse.
- Du erkennst die Ursachen: Objektidentität als `track`-Schlüssel, zu viele DOM-Knoten, zu häufige Neuberechnung.
- Du bewertest Maßnahmen nach Wirkung und Aufwand.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- `track customer.id` hilft vor allem, wenn die Daten neu geladen werden: Mit `track customer` gelten die neuen Objekte als neu und alle DOM-Elemente werden ersetzt. Bei Virtual Scrolling übernimmt `trackBy: (index, customer) => customer.id` an `*cdkVirtualFor` diese Rolle.
- `*cdkVirtualFor` ersetzt hier das `@for`. Der Viewport braucht eine feste Höhe (CSS) und `itemSize` muss zur Zeilenhöhe passen (hier 32px, festgelegt in der CSS der Zeilenkomponente). Importiere `ScrollingModule` aus `@angular/cdk/scrolling`.
- Die Zeilenkomponente bekommt für den Virtual-Scroll-Viewport einen allgemeinen Attribut-Selektor (`[customer-list-item]`) und wird als `<div customer-list-item>` verwendet.
- Debounce: Das Eingabefeld zeigt den getippten Text sofort (eigenes Signal `typedFilter`), der Store bekommt den Text per `toObservable(...).pipe(debounceTime(250), takeUntilDestroyed())`. Das Leeren des Filters wirkt ohne Wartezeit.
- Lazy Route: `loadComponent: () => import('./customer/customer-details/customer-details.component').then(m => m.CustomerDetailsComponent)` und den statischen Import in `app.routes.ts` entfernen. Im Build erscheint ein eigener „Lazy chunk“.
- Diese Lösung lässt den Lastgenerator eingeschaltet (`LOAD_TEST_SIZE` = 5000), damit der Effekt sichtbar bleibt. In Übung 36 wird er abgeschaltet.
- Hinweis: In `CustomerDetailsComponent` steht kein `CommonModule` mehr (nur noch `DatePipe`, `FormsModule`, `NgOptimizedImage`), die Bundle-Hygiene ist dort also schon erledigt.
