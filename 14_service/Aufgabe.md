# Übung 14: Erstelle einen CustomerService

## Aufgabe

Lagere die Kundendaten aus der Komponente in einen eigenen Service aus.

1. Erzeuge einen Service `CustomerService`, generiert per `ng generate service customer/customer`.
2. Lege Mock-Daten (eine Liste von Beispiel-Kunden) in einer eigenen Datei an, getrennt vom Service selbst.
3. Implementiere im Service eine Methode, die diese Mock-Daten zurückgibt (z. B. `getAll(): Customer[]`).

## Lernziele

- Du kannst per CLI einen Service erzeugen und verstehst seine Grundstruktur (`@Injectable`-Klasse).
- Du weißt, warum man Fachdaten und Logik aus Komponenten in Services auslagert (Trennung von UI und Datenhaltung).
- Du kennst die Best Practice, Mock-Daten in eine eigene Datei parallel zum Service zu legen.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- `ng generate service` versieht die neue Klasse bereits automatisch mit `@Injectable({ providedIn: 'root' })`.
- Die Mock-Daten-Datei kann z. B. `customer.mock.ts` heißen und ein exportiertes, konstantes Array enthalten.
- Der Service selbst muss die Komponenten an dieser Stelle noch nicht kennen – das folgt erst in der nächsten Übung (Dependency Injection).
