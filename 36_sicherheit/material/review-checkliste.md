# Review-Checkliste Frontend-Sicherheit (Übung 36)

Gehe die Punkte für die **komplette App** durch (`invoice-app/src`). Suche nicht nur nach dem Stichwort, sondern lies die Stellen: Entscheidend ist, woher ein Wert kommt und wohin er fließt. Trage Funde in die Tabelle unten ein.

## Checkliste

- [ ] Wird irgendwo `bypassSecurityTrust*` verwendet? Ist die Verwendung im Code begründet?
- [ ] Gibt es `innerHTML`, `[innerHTML]`, `nativeElement.innerHTML`, `document.write`, `eval` oder `new Function`?
- [ ] Werden URL-Parameter (Query, Pfad, Fragment) ungeprüft für Navigation, Anzeige oder zum Bauen von Requests genutzt?
- [ ] Werden Tokens oder personenbezogene Daten geloggt (Konsole, Interceptor) oder in `localStorage` abgelegt?
- [ ] Stehen Geheimnisse (Schlüssel, Passwörter) in `environment*.ts` oder im Bundle?
- [ ] Verlässt sich eine Funktion nur auf einen Guard statt auf das Backend?
- [ ] Neue Abhängigkeiten geprüft (`npm audit`, Pflegezustand, wirklich nötig)?

Suchhilfe (im Ordner `invoice-app/src`):

```
grep -rn "bypassSecurityTrust\|innerHTML\|nativeElement\|document\.\|eval(\|new Function" .
grep -rn "localStorage\|sessionStorage\|console\.log" .
grep -rn "queryParams\|snapshot\|params\|returnUrl" .
grep -rn "api/customer/\" *+" .
```

## Funde (Vorlage)

| Nr. | Datei / Stelle | Befund | Schwere (hoch/mittel/niedrig) | Maßnahme |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## Trainer-Auswertung für diese Lösung

*Erst nach der Übung lesen.*

| Nr. | Datei / Stelle | Befund | Bewertung | Maßnahme |
|---|---|---|---|---|
| 1 | `customer/note-demo/note-demo.component.ts` | `bypassSecurityTrustHtml` | Review-Alarm. Bewusst als Gegenbeispiel, hinter einer Checkbox, kommentiert. In echtem Code nicht akzeptabel für Nutzer- oder Backend-Daten. | Nur für selbst kontrolliertes HTML einsetzen, Begründung im Code, besser entfernen |
| 2 | `customer/note-demo/note-demo.component.html` | `[innerHTML]` | Von Angular bereinigt (Skripte und Event-Handler werden entfernt). Trotzdem: Wird wirklich HTML gebraucht, oder reicht Text? | Interpolation bevorzugen, `[innerHTML]` begründen |
| 3 | `auth/login/login.component.ts`, `auth/return-url.ts` | `returnUrl` kommt aus der URL (offene Weiterleitung) | Behoben: Allowlist, nur interne Pfade unter `/customer` | Test für gültige und ungültige Werte vorhanden |
| 4 | `auth/logging.interceptor.ts` | Interceptor könnte Header/Tokens ausgeben | In Ordnung: Es werden nur Methode, URL, Status und Dauer geloggt. Früher wurde das komplette Fehlerobjekt ausgegeben. | Test stellt sicher, dass `Authorization` nie im Log steht |
| 5 | `customer/customer.service.ts` | Die ID aus der URL wurde direkt in die Request-URL eingesetzt (`"api/customer/" + id`) | Behoben mit `encodeURIComponent`. Mittel: Eine ID wie `1%2F..%2Fadmin` hätte sonst einen anderen Endpunkt angesprochen. | Test vorhanden |
| 6 | `customer/customer.store.ts` | Der Filtertext wird in `localStorage` gespeichert | Niedrig: Der Text kann personenbezogene Daten enthalten (Namen). Bewusst akzeptiert, in echten Projekten abwägen (Datensparsamkeit). | Dokumentieren, ggf. `sessionStorage` |
| 7 | `auth/auth.guard.ts`, `server/server.js` | Der Login ist nur eine Frontend-Simulation, das Backend prüft nichts | Hoch (in einem echten Projekt): Jeder kann die API direkt aufrufen. | Authentifizierung und Autorisierung im Backend, Guard nur für die Oberfläche |
| 8 | `customer/customer.service.ts` | Hartkodierte Demo-Notiz mit Schadcode (`DEMO_NOTE`) | Nur Lehrmaterial. Gehört nicht in Produktivcode. | Vor dem Release entfernen |
| 9 | `package.json` | Abhängigkeiten | `npm audit` meldet für das Test-Werkzeug Vitest eine Warnung (nur Entwicklung, nicht im Bundle). Aktualisieren, sobald die neuere Version mit dem eingesetzten npm installierbar ist. | `npm audit` in die Pipeline aufnehmen |
| 10 | `environment*.ts` | Geheimnisse im Bundle | Keine gefunden (nur das Flag `production`). | – |
