# Übung 26: Resource API (httpResource / rxResource)

## Aufgabe

Stelle die Datenbeschaffung von RxJS-Subscriptions auf die neue signal-basierte Resource API um.

1. Ersetze in `CustomerListComponent` den bisherigen `toSignal(customerService.getAll())`-Ansatz durch `httpResource()`, das direkt per HTTP GET die Kundenliste lädt.
2. Nutze die vom Resource zurückgegebenen Signals `value()`, `isLoading()` und `error()`, um in der Liste einen Ladehinweis bzw. eine Fehlermeldung anzuzeigen.
3. Ersetze in `CustomerDetailsComponent` den bisherigen `effect()` + manuellen `getCustomerById()`-Aufruf durch `rxResource()`, das reaktiv auf Änderungen des `id()`-Inputs reagiert und automatisch neu lädt.
4. Das Speichern (`update()`) bleibt weiterhin eine klassische, einmalige Mutation über `CustomerService` – die Resource API ist primär für das (mehrfach wiederholte) Lesen von Daten gedacht.

## Lernziele

- Du verstehst den Unterschied zwischen der Resource API (`httpResource`, `rxResource`, `resource`) und dem bisherigen Muster aus Service + Observable + `toSignal()`.
- Du kennst die von einer Resource bereitgestellten Signals: `value()`, `isLoading()`, `error()`, `status()`.
- Du weißt, dass `rxResource()` automatisch neu lädt, wenn sich sein `params`-Signal ändert – ganz ohne manuellen `effect()`.
- Du kannst einschätzen, wann die Resource API (reaktives Lesen) sinnvoll ist und wann weiterhin ein klassischer `HttpClient`-Aufruf (einmalige Mutation wie POST/PUT) die bessere Wahl ist.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- `httpResource<T>(() => url)` erwartet eine Funktion, die reaktiv die URL (oder `undefined`, um das Laden zu pausieren) liefert.
- `rxResource({ params: () => ..., stream: ({ params }) => observable })` kombiniert ein reaktives `params`-Signal mit einem RxJS-Observable als Datenquelle – ideal für bestehende Service-Methoden, die weiterhin ein `Observable` zurückgeben.
- Beide APIs sind aktuell noch als `@experimental` markiert; die Signatur kann sich in künftigen Angular-Versionen noch leicht ändern.
- Wirf innerhalb von `stream` einen Fehler (oder gib ein Observable zurück, das mit `error` terminiert), wenn keine gültigen Parameter vorhanden sind – die Resource setzt dann automatisch `error()`.
