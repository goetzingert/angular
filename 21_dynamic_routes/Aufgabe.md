# Übung 21: Routing mit Parametern

## Aufgabe

Erstelle eine Route für die Detailansicht eines einzelnen Kunden, inklusive dynamischem Pfadparameter.

1. Konfiguriere eine Route für `/customer/:id`, die auf `CustomerDetailComponent` verweist.
2. Erweitere `CustomerService` um eine Methode `getById(id): Observable<Customer>`, die genau einen Kunden anhand seiner ID liefert.
3. Aktiviere `withComponentInputBinding()` bei `provideRouter(...)`, damit der Routenparameter `:id` automatisch als Input in `CustomerDetailComponent` ankommt.
4. Nimm die ID in `CustomerDetailComponent` als Signal-Input entgegen (z. B. `id = input.required<string>();`) und lade darauf basierend den passenden Kunden.

## Lernziele

- Du kannst dynamische Pfadparameter (`:id`) in einer Route definieren.
- Du verstehst, wie `withComponentInputBinding()` Routenparameter automatisch als Component-Input bereitstellt, ohne `ActivatedRoute` manuell abonnieren zu müssen.
- Du kannst mit `toSignal(toObservable(...))` automatisch neu laden, wenn sich ein Input (die ID) ändert.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Die Datei `customer-list.component.html` zeigt bereits, wie mit `[routerLink]="[customer.id]"` zur Detailseite eines Kunden verlinkt wird.
- Der Parametername in der Route (`:id`) muss exakt zum Namen des Inputs in der Komponente passen (`id`).
- Falls der Kunde beim Laden noch nicht da ist, hilft ein `@if`-Block im Template, um kurz einen Ladehinweis anzuzeigen.
