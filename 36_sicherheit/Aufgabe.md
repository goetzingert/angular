# Übung 36: XSS erleben und beheben

**Zeitrichtwert:** ca. 40 Minuten

Basis: Ergebnis von Übung 35 (`35_performance`). Das Backend bleibt unverändert; die Notiz wird **clientseitig** ergänzt. Die Review-Checkliste für Schritt 8 liegt in `material/review-checkliste.md`.

## Aufgabe

0. Schalte den Lastgenerator aus Übung 35 ab (`LOAD_TEST_SIZE`, Standardwert `0`), damit die Liste wieder nur die echten Kunden zeigt.
1. **Feld ergänzen.** `Customer` erhält `note?: string`. Der `CustomerService` setzt für Kunde 1 nach dem Laden die Notiz `<b>wichtig</b> <img src=x onerror="alert('XSS')">` (Konstante im Service, nur für diese Übung).
2. **Anzeige 1:** Gib die Notiz in `CustomerDetailsComponent` per Interpolation aus (`{{ c.note }}`). Was siehst du?
3. **Anzeige 2:** Gib sie per `[innerHTML]` aus. Prüfe in den Browser-Entwicklertools (Elements), was von Angular übrig bleibt (Formatierung ja, `onerror` nein).
4. **Anzeige 3 (Gegenbeispiel):** Gib sie mit `DomSanitizer.bypassSecurityTrustHtml` aus. Das `alert` erscheint. Diskussion: Wann wäre das akzeptabel? Baue dieses Gegenbeispiel nur in eine getrennte Demo-Komponente hinter einen Schalter, nie in den normalen Ablauf.
5. **Weiterleitung prüfen.** Der Guard hängt die angeforderte Adresse als `?returnUrl=` an die Login-Seite an. Die Login-Seite liest `returnUrl` und navigiert dorthin. Baue eine **Allowlist-Prüfung**: Nur Pfade, die mit `/customer` beginnen, sind erlaubt, absolute URLs und fremde Hosts werden verworfen (dann: Standardziel `/customer`).
6. **Logging prüfen.** Der `loggingInterceptor` (Übung 25) darf Header wie `Authorization` nie ausgeben. Prüfe den Code und ergänze einen Test (oder einen Review-Kommentar).
7. **Request-URLs prüfen.** Wo wird ein Wert aus der Adresszeile (z. B. die ID) in eine URL eingesetzt? Was passiert bei Sonderzeichen?
8. **Review.** Gehe die Checkliste (`material/review-checkliste.md`) für die komplette App durch und dokumentiere die Funde in der Tabelle.

## Lernziele

- Du erkennst Vertrauensgrenzen: Alles, was von außen kommt (auch aus dem eigenen Backend), ist Eingabe.
- Du verstehst, was Angular standardmäßig tut (Escaping bei Interpolation, Bereinigung bei `[innerHTML]`) und wo der Schutz ausgehebelt wird (`bypassSecurityTrust*`).
- Du setzt Basisschutz um: Allowlist für Weiterleitungen, keine sensiblen Daten im Log, kontextgerechtes Kodieren von URL-Teilen.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Diese Lösung zeigt alle drei Anzeige-Varianten in der Demo-Komponente `NoteDemoComponent` (`customer/note-demo/`). Die unsichere Variante läuft **nur**, wenn man die Checkbox anklickt, und ist im Code als „bewusst unsicher“ gekennzeichnet. Sie ist keine Empfehlung.
- Für Schritt 5: `new URL(value, window.location.origin)` löst relative Pfade gegen die eigene Origin auf. Prüfe `origin` (muss die eigene sein) und `pathname` (muss `/customer` sein oder mit `/customer/` beginnen). Erst dann `router.navigateByUrl(pathname)`. Das fängt auch `//evil.example`, `javascript:...` und `/customer/../admin` ab (der Pfad wird normalisiert). Die Funktion `safeReturnUrl` liegt in `auth/return-url.ts` und hat Tests.
- Der Guard kennt die angeforderte Adresse über das zweite Argument `state.url`: `(route, state) => ...`.
- Mit `withComponentInputBinding()` (in `main.ts` bereits aktiv) landen Query-Parameter in `input()`-Feldern der Routing-Komponente: `returnUrl = input<string>()`.
- Für Schritt 6 reicht ein Test mit `HttpTestingController`, der einen Request mit `Authorization`-Header sendet und prüft, dass `console.log` (per `vi.spyOn(console, 'log')`) den Wert nie enthält.
- Für Schritt 7: `"api/customer/" + id` ist ein Beispiel für eine Eingabe, die in eine URL fließt. `encodeURIComponent(id)` sorgt dafür, dass `/` und `..` nicht den Pfad verändern.
- Die Trainer-Auswertung der Checkliste steht am Ende von `material/review-checkliste.md`.
