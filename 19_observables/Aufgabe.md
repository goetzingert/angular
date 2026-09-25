# Übung 19: Async CustomerService

## Aufgabe

Verpasse `CustomerService` eine Observable-basierte API statt einfacher, synchroner Rückgabewerte.

1. Lege im Service ein `ReplaySubject` als privates Feld an.
2. Rufe im Konstruktor einmalig `next(...)` auf diesem Subject auf, um die vorhandenen Mock-Daten „hineinzugeben“.
3. Ändere die öffentliche Methode (z. B. `getAll()`) so, dass sie statt eines direkten Arrays das Observable dieses Subjects zurückgibt.
4. Passe die nutzende Komponente an, damit sie mit dem Observable statt einem direkten Wert umgeht – z. B. über `toSignal(...)`.

## Lernziele

- Du verstehst, wie man eine synchron vorliegende Datenquelle (Mock-Daten) wie eine asynchrone Quelle über ein Observable anbietet.
- Du kannst `toSignal()` nutzen, um ein Observable direkt als Signal im Template zu verwenden, ohne manuell zu abonnieren.
- Du weißt, warum das automatische Beenden der Subscription (z. B. durch `toSignal` oder die `async`-Pipe) wichtig ist, um Speicherlecks zu vermeiden.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Ein `ReplaySubject` „merkt“ sich den letzten (oder mehrere) zuvor gesendete(n) Wert(e) und gibt ihn/sie auch neuen Abonnenten, die sich später anmelden.
- `toSignal(observable$, { initialValue: [] })` ist die einfachste Art, ein Observable im Template ohne `async`-Pipe zu nutzen.
- Achte darauf, dass die Methode jetzt konsequent `Observable<Customer[]>` statt `Customer[]` als Rückgabetyp hat.
