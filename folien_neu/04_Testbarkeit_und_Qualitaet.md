# Kapitel 4 – Qualitätssicherung: Testbarkeit und automatisiert erzeugte Tests

**Tag:** 4 (Ende) bis 5 (Vormittag) · **Dauer:** ca. 90 min inkl. Übung
**Agenda:** „Rolle von Tests in modernen Anwendungen“ / „Zusammenhang zwischen Struktur und Testbarkeit“ / „Umgang mit Abhängigkeiten beim isolierten Testen“ / „Automatisiert erzeugte Tests richtig einordnen“
**Übung:** Ü34 `34_tests` (Basis: Ü33)
**Verzahnung:** Ergänzt das Deck `Testing_angular21.pptx`. Empfehlung dort: Vitest als Hauptpfad, Karma/Jasmine nur als Hinweis für Bestandsprojekte, Cypress als Wahlthema.

---

### Folie 4.1 – Wofür Tests? (Rolle in modernen Anwendungen)
- **Sicherheitsnetz** für Änderungen (Refactoring ohne Angst).
- **Dokumentation** des erwarteten Verhaltens.
- **Frühes Feedback** im Entwicklungsprozess und in der Pipeline.
- Tests sind **Code mit Wartungskosten**: schlechte Tests bremsen mehr, als sie helfen.

### Folie 4.2 – Testpyramide (Wiederholung, mit Angular-Bezug)
```
        /  E2E  \          wenige: kritische Abläufe (Playwright/Cypress)
       /Komponenten\       mittel: Template + Klasse (TestBed)
      /  Unit-Tests  \     viele: Services, Stores, pure Funktionen
```
- Mehr Logik außerhalb von Komponenten → mehr schnelle Unit-Tests möglich.

### Folie 4.3 – Struktur bestimmt Testbarkeit
| Eigenschaft | Testet sich … |
|---|---|
| Pure Funktion / Pipe | trivial (Eingabe → Ausgabe) |
| Store/Service mit Signals | einfach (Methode aufrufen, Signal lesen) |
| Darstellungskomponente (`input`/`output`) | einfach (Input setzen, Output prüfen) |
| Container mit mehreren Services | aufwendig (Mocks nötig) |
| Komponente mit DOM-/`window`-Zugriff, Singletons | schwer |

- **Vorher/Nachher:** Eine Komponente, die selbst `HttpClient` aufruft und filtert, braucht HTTP-Mocks und DOM. Dieselbe Logik im Store: 5 Zeilen ohne `TestBed`.

### Folie 4.4 – Vitest-Grundlagen
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('CustomerStore', () => {
  let store: CustomerStore;
  beforeEach(() => { store = TestBed.inject(CustomerStore); });

  it('filtert nach Vornamen (Groß-/Kleinschreibung egal)', () => {
    store.setCustomers([new Customer('Hans', 'M'), new Customer('Lisa', 'S')]);
    store.setFilter('LI');
    expect(store.filtered().map(c => c.firstname)).toEqual(['Lisa']);
  });
});
```
- Werkzeuge: `vi.fn()` (Mock-Funktion), `vi.spyOn()`, `vi.useFakeTimers()`.
- Struktur **Arrange – Act – Assert**; ein Test prüft **ein** Verhalten.
- Testnamen beschreiben Verhalten („filtert … “), nicht Methodennamen.

### Folie 4.5 – Abhängigkeiten isolieren
| Technik | Idee | Wann |
|---|---|---|
| **Stub/Fake** | einfache Ersatzimplementierung | Service mit festen Daten |
| **Mock** (`vi.fn`) | prüft Aufrufe | „wurde `update` mit X aufgerufen?“ |
| **Spy** | echtes Objekt, beobachtet | selten, bei Legacy |
| **echte Abhängigkeit** | kein Ersatz | reine Funktionen, billige Hilfsklassen |

```ts
TestBed.configureTestingModule({
  providers: [{ provide: CustomerApi, useValue: { getAll: () => of([hans, lisa]) } }],
});
```
- DI macht das einfach: Ersatz über `providers` statt Code ändern.
- **Over-Mocking vermeiden:** Wer alles mockt, testet nur die Mocks.

### Folie 4.6 – HTTP testen
```ts
TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()],
});
const http = TestBed.inject(HttpTestingController);

service.getAll().subscribe(r => result = r);
http.expectOne('api/customer').flush({ data: [hans] });
http.verify();            // keine unerwarteten Requests
expect(result).toEqual([hans]);
```

### Folie 4.7 – Komponenten mit Signal-Inputs testen
```ts
const fixture = TestBed.createComponent(CustomerListItemComponent);
fixture.componentRef.setInput('customer', hans);     // Signal-Input setzen
await fixture.whenStable();                           // Rendering abwarten
expect(fixture.nativeElement.textContent).toContain('Hans');

const spy = vi.fn();
fixture.componentInstance.chosen.subscribe(spy);
fixture.nativeElement.querySelector('li').click();
expect(spy).toHaveBeenCalledWith(hans);
```
- Inputs **nie** direkt zuweisen (`component.customer = …` funktioniert bei Signal-Inputs nicht), sondern `setInput`.
- Zoneless: nicht auf automatische Change Detection verlassen, `await fixture.whenStable()` verwenden.

### Folie 4.8 – Signals und Effects testen
- `signal`/`computed`: ohne `TestBed`, direkt testen.
- `effect`: braucht Injection Context und ein „Tick“:
```ts
TestBed.runInInjectionContext(() => { store = new CustomerStore(); });
store.setFilter('x');
TestBed.tick();                 // führt anstehende Effects aus
expect(localStorage.getItem('customerFilter')).toBe('x');
```

### Folie 4.9 – Was macht einen guten Test aus?
- **Schlägt fehl, wenn das Verhalten kaputt ist** (und nur dann).
- **Unabhängig** von Reihenfolge und anderen Tests.
- **Schnell** und **deterministisch** (keine echten Timer, kein Netz).
- **Lesbar:** Arrange/Act/Assert, sprechende Namen, kleine Testdaten.
- Prüft **Verhalten**, nicht Implementierungsdetails (private Felder, CSS-Klassen).
- **Coverage ist Hinweis, kein Ziel.** 100 % Zeilenabdeckung ohne Assertions beweist nichts.

### Folie 4.10 – Automatisch erzeugte Tests richtig einordnen
Quellen: `ng generate` (Spec-Gerüste), IDE-Assistenten, KI-Werkzeuge.

| Typisches Muster | Problem |
|---|---|
| `it('should create', () => expect(component).toBeTruthy())` | prüft nur, dass Instanziierung klappt |
| Test wiederholt die Implementierung (`expect(f(2)).toBe(2*2)`) | Tautologie: ändert sich Code und Test gleichzeitig, fällt nichts auf |
| Alles gemockt, nur Mock-Aufrufe geprüft | testet nicht das echte Verhalten |
| Nur Happy Path | Randfälle (leer, `null`, Fehler, Grenzwerte) fehlen |
| Snapshot/`toMatchSnapshot` großer Templates | bricht bei jeder Änderung, wird blind aktualisiert |
| Test passt sich dem Bug an | bestätigt falsches Verhalten |

### Folie 4.11 – Prüfverfahren für generierte Tests
1. **Lesen:** Was behauptet der Test? Passt das zur Anforderung?
2. **Kaputtmachen („Mutationstest von Hand“):** Produktivcode absichtlich ändern – wird der Test rot? Wenn nicht, ist er wertlos.
3. **Randfälle ergänzen:** leer, sehr groß, Fehlerfall, Sonderzeichen.
4. **Vereinfachen:** Mocks reduzieren, Namen verbessern.
5. **Verantwortung:** Wer den Test committet, haftet für ihn – nicht das Werkzeug.

---

## Übung 34 – Tests schreiben und bewerten (`34_tests`)

**Basis:** Ergebnis von Ü33. Test-Runner: Vitest (Projekt entsprechend konfigurieren, falls noch Karma/Jasmine).

**Teil A – Store testen (ohne UI):**
1. Schreibe Tests für `CustomerStore`: Filter (Groß-/Kleinschreibung), Auswahl, leere Liste, Filter ohne Treffer.
2. Mocke `CustomerApi` per `providers`.

**Teil B – Darstellungskomponente testen:**
3. Teste `CustomerListItemComponent`: Name wird angezeigt, Klick löst `chosen` mit dem Kunden aus.

**Teil C – Generierten Test bewerten:**
4. Die Aufgabe enthält eine „generierte“ Spec für `CustomerStore` mit 5 versteckten Schwächen (u. a. `toBeTruthy`, Tautologie, fehlender Fehlerfall).
5. Finde die Schwächen, mache den Produktivcode gezielt kaputt und zeige, welche Tests **nicht** rot werden. Verbessere die Spec.

**Lernziele:** Struktur ↔ Testbarkeit erleben, Abhängigkeiten per DI ersetzen, generierte Tests kritisch prüfen.

**Lösungshinweise:** `fixture.componentRef.setInput(...)` für Signal-Inputs; für Teil C genügt es, in `filtered` den Vergleich von `includes` auf `startsWith` zu ändern und zu prüfen, welche Tests das bemerken.
