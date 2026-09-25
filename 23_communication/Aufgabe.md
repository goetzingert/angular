# Übung 23 & 24: Speichern über den Service und Anbindung ans Backend

## Aufgabe

Speichere bearbeitete Kundendaten über den Service und binde den Service anschließend an ein echtes Backend an.

Teil 1 (Übung 23 – Update):
1. Stelle in `CustomerService` eine Methode `update(customer)` bereit.
2. Rufe diese Methode beim Speichern des Formulars in `CustomerDetailsComponent` auf.
3. Ersetze im Service das ursprüngliche Customer-Objekt in der Datenliste durch die bearbeitete Version.

Teil 2 (Übung 24 – HTTP-Anbindung, im Hinweis-Abschnitt gelöst):
4. Entpacke `server-js.zip`, installiere per `npm install` und starte den Server mit `node server.js` (läuft auf `localhost:3000`).
5. Registriere `provideHttpClient()` in `main.ts` und starte den Angular-Dev-Server mit Proxy-Konfiguration (`dev.proxy.json`).
6. Verwende in `CustomerService` statt der Mock-Daten `inject(HttpClient)`, um die Kundenliste tatsächlich vom Backend zu laden.

## Lernziele

- Du kannst einen Service um eine Update-Methode erweitern und Formulardaten darüber persistieren.
- Du weißt, wie `HttpClient` per Dependency Injection genutzt und über `provideHttpClient()` bereitgestellt wird.
- Du verstehst, wie ein Dev-Proxy (`dev.proxy.json`) Anfragen an ein separates Backend weiterleitet, ohne CORS-Probleme.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Für Teil 1 reicht es, im Mock-Array das Element mit passender ID zu finden und durch das neue Objekt zu ersetzen (z. B. per `map`).
- Für Teil 2: Die REST-Endpunkte des Beispiel-Servers lauten u. a. `GET api/customer`, `GET api/customer/:id`, `POST api/customer`, `PUT/PATCH/DELETE api/customer/:id`.
- Diese Projektstufe (`23_communication`) enthält bereits die vollständige, funktionierende HTTP-Anbindung als Musterlösung für Übung 24 – es gibt dafür keinen eigenen Ordner „24“.
