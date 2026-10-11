# Übung 34: Tests schreiben und bewerten

**Zeitrichtwert:** ca. 45 Minuten

Basis: Ergebnis von Übung 33 (`33_state_store`). Test-Runner ist Vitest (`ng test`, im Projekt bereits konfiguriert). Das Material für Teil C liegt in `material/generierter-store-test.spec.ts.txt` (neben dieser Datei).

## Aufgabe

**Teil A – Store testen (ohne UI)**

1. Schreibe Tests für `CustomerStore` in `customer.store.spec.ts`: Laden, Filter (Groß-/Kleinschreibung, Teiltreffer), Filter ohne Treffer, leere Liste, Auswahl (auch unbekannte ID), Fehlerfall beim Laden, Filter in `localStorage`.
2. Ersetze die einzige Abhängigkeit des Stores, den `CustomerService`, per `providers` durch ein Test-Double: `{ provide: CustomerService, useValue: { getAll } }` mit `const getAll = vi.fn()`.
3. Der `effect` braucht einen "Tick": nach `store.setFilter('x')` führt `TestBed.tick()` die anstehenden Effects aus.

**Teil B – Darstellungskomponente testen**

4. Teste `CustomerListItemComponent`: Der Name wird angezeigt, ohne Stadt kein Doppelpunkt, ein Klick löst `chosen` mit dem Kunden aus, die Klassen `discontinued` und `selected` werden gesetzt.
5. Optional: Teste `CustomerFilterComponent` (Eingabe löst `changed` aus, Button löst `cleared` aus und setzt den Fokus) und den `CustomerService` mit `HttpTestingController` (Datumsumwandlung, `PUT` beim Update, Fehlerfall).

**Teil C – Generierten Test bewerten**

6. Speichere `material/generierter-store-test.spec.ts.txt` als `src/app/customer/customer.store.generated.spec.ts` und führe sie aus: Alles ist grün.
7. Finde die fünf versteckten Schwächen. Mache dann den Produktivcode gezielt kaputt (siehe Lösungshinweise) und zeige, welche Tests **nicht** rot werden. Verbessere die Spec.
8. Lösche die Datei danach wieder (oder lass sie mit der verbesserten Fassung deiner Spec verschmelzen).

## Lernziele

- Du erlebst, wie die Struktur (Store, Darstellungskomponente) die Testbarkeit verbessert.
- Du ersetzt Abhängigkeiten per Dependency Injection, statt zu mocken, was nicht nötig ist.
- Du testest Signal-Inputs (`fixture.componentRef.setInput`), Outputs und Effects.
- Du prüfst generierte Tests kritisch, bevor du sie übernimmst.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Signal-Inputs setzt du mit `fixture.componentRef.setInput('customer', ...)`, bevor das Template zum ersten Mal gerendert wird (`input.required` wirft sonst einen Fehler).
- Outputs kannst du direkt abonnieren: `component.chosen.subscribe(value => ...)`.
- Für Mocks in Vitest: `vi.fn()` und `vi.spyOn(...)` (nicht `jasmine.createSpyObj`/`spyOn`). Mit `mockReturnValue(of(...))` bzw. `throwError(() => ...)` steuerst du, was das Test-Double liefert.
- `HttpTestingController` (mit `provideHttpClientTesting()`): `expectOne(url).flush(...)` beantwortet die Anfrage; `verify()` in `afterEach` stellt sicher, dass kein Request offen bleibt.
- Ein asynchrones `store.load()` (basiert auf `firstValueFrom`) kannst du direkt mit `await` abwarten.
- Die fünf Schwächen der generierten Spec:
  1. `toBeTruthy()` an mehreren Stellen (`should create`, `selected`, `total`): Die Tests bestehen auch bei komplett falschem Ergebnis.
  2. Tautologie: Der Filter-Test berechnet das erwartete Ergebnis mit derselben Logik wie der Produktivcode.
  3. Over-Mocking: Die Tests prüfen nur, dass ein Mock bzw. Spy aufgerufen wurde (`getAll` wurde aufgerufen, `setFilter` wurde aufgerufen), nicht das echte Verhalten.
  4. Der Fehlerfall fehlt: Was passiert, wenn `getAll()` fehlschlägt?
  5. Nur Happy Path: keine leere Liste, kein Filter ohne Treffer, kein Test mit Groß-/Kleinschreibung, keine unbekannte ID.
- Mutationstest von Hand: Ändere in `filtered` den Vergleich von `includes` auf `startsWith`. Die generierte Spec bleibt komplett grün, in der verbesserten Spec schlägt der Test „should match inside the first name, not only at the start“ fehl.
- Der Ordner `34_tests` enthält die verbesserte Spec als Lösung (`customer.store.spec.ts`). Die generierte Spec liegt bewusst nur als `.txt` im Ordner `material/`.
