# Übung 38: Abschlussprojekt „Kunden-Dashboard“

Basis: Ergebnis von Übung 37 (`37_ki_review`).

## Aufgabe

Baue ein neues Feature „**Kunden-Dashboard**“: eine Seite unter der Route `/dashboard` mit den Kennzahlen

- Anzahl der Kunden,
- aktive Kunden (Bestellung in den letzten 7 Tagen),
- Kunden pro Stadt.

Vorgehen in Kleingruppen, **mit KI-Unterstützung nach Wahl**:

1. Schreibe einen Plan (fünf Schritte) und stimme ihn im Team ab, bevor Code entsteht.
2. Setze in kleinen Schritten um, je Schritt ein Commit.
3. Anforderungen:
   - Kennzahlen als `computed` (Kapitel 2).
   - Daten über den `CustomerStore` (Kapitel 3), kein eigener HTTP-Aufruf in der Komponente.
   - Lazy geladene Route (Kapitel 5), geschützt durch den `authGuard`.
   - Keine unsicheren Muster (Kapitel 6): kein `innerHTML`, keine ungeprüften Parameter.
   - Mindestens drei sinnvolle Tests (Kapitel 4).
   - Für „aktiv in den letzten 7 Tagen“ soll die vorhandene Logik (`CurrentActiveCustomersPipe`) wiederverwendet werden.
4. Selbst-Review mit den Checklisten (Kapitel 1, 4, 6 und 7).
5. Kurzvorstellung (5 Minuten pro Gruppe): Was hat die KI gut gemacht, wo musste korrigiert werden?

**Bewertungskriterien:** Architektur, Reaktivität, Tests, Sicherheit, Nachvollziehbarkeit des Vorgehens.

## Lernziele

- Du setzt ein kleines Feature von der Planung bis zum Test um und wendest dabei die Themen der Kapitel 1 bis 7 an.
- Du nutzt eine KI als Werkzeug und prüfst ihre Ergebnisse kritisch.
- Du dokumentierst dein Vorgehen nachvollziehbar.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

Aufbau der Musterlösung (ein möglicher Weg, nicht der einzige):

1. `customer/dashboard/customer-dashboard.component.ts` mit `OnPush`. Die Komponente ruft im Konstruktor `store.load()` auf und enthält nur `computed`-Signals: `total`, `activeLast7Days` und `customersPerCity`.
2. Die Pipe ist eine reine Klasse ohne Abhängigkeiten, deshalb genügt `new CurrentActiveCustomersPipe().transform(customer.lastOrderDate, 7)`. Kunden ohne Bestelldatum zählen als nicht aktiv.
3. Kunden pro Stadt: eine `Map<string, number>` aufbauen, Kunden ohne Stadt unter „Unbekannt“ zusammenfassen, absteigend nach Anzahl und bei Gleichstand alphabetisch sortieren.
4. Route in `app.routes.ts`: `{ path: 'dashboard', loadComponent: () => import('...').then(m => m.CustomerDashboardComponent), canActivate: [authGuard] }`.
5. Der Guard hängt `returnUrl=/dashboard` an die Login-Seite an. Damit man danach wirklich dort landet, muss `/dashboard` in die Allowlist von `auth/return-url.ts` aufgenommen werden (Test ergänzen).
6. Navigation: Links „Kunden“ und „Dashboard“ im Kopfbereich der `AppComponent` (`RouterLink` importieren).
7. Tests (in der Lösung mehr als gefordert): Anzahl, aktive Kunden (Grenzfälle heute, 6 und 8 Tage, nie bestellt), Kunden pro Stadt (Sortierung, „Unbekannt“), leere Liste, Aktualisierung bei neuen Daten, Fehleranzeige, Lazy Route und Guard.
8. Testdaten für die Dashboard-Tests: `CustomerService` per `providers` durch `{ getAll: vi.fn() }` ersetzen, den Lastgenerator mit `{ provide: LOAD_TEST_SIZE, useValue: 0 }` abschalten.
