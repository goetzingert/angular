# Format der Folien-Beschreibung (JSON) für `build_deck.py`

Das Werkzeug `folien_neu/deck/build_deck.py` liest alle `folien_neu/deck/content_*.json` und fügt sie in eine **Kopie** von `presentation_angular21.pptx` ein. Alle Folienverweise beziehen sich auf die **ursprüngliche Nummerierung** (1-basiert) der unveränderten Originaldatei. Das Werkzeug rechnet selbst um.

## Datei-Aufbau

```json
{
  "blocks": [
    {
      "after": 267,
      "order": 10,
      "slides": [ { ...Folie... }, { ...Folie... } ]
    }
  ],
  "ops": [
    { "op": "move",   "from": 217, "to": 219, "after": 291 },
    { "op": "delete", "slides": [100, 101] },
    { "op": "edit",   "slide": 233, "title": "…", "bullets": ["…"], "notes": "…" },
    { "op": "replace_text", "slide": 85, "old": "Übung 25", "new": "Übung 30", "include_notes": true }
  ]
}
```

- `after`: Nummer der Originalfolie, hinter die eingefügt wird; `0` = ganz an den Anfang. Mehrere Blöcke mit gleichem `after` werden nach `order` (aufsteigend), dann nach Dateiname sortiert.
- `move`: verschiebt die Originalfolien `from`..`to` (einschließlich) hinter Originalfolie `after`.
- `edit`: überschreibt Titel/Aufzählungen/Notizen einer Originalfolie (nicht angegebene Felder bleiben).
- `replace_text`: Textersetzung in allen Textfeldern der Folie (und optional in den Notizen).
- Reihenfolge der Auswertung: delete → move → edit/replace_text → Einfügungen.

## Folientypen

Jede Folie hat `type`, `title`, `notes` (Sprechtext, **Pflicht**) und je nach Typ weitere Felder.

| `type` | Vorlage im Deck | Felder |
|---|---|---|
| `content` | Folie 256 (Titel + Aufzählung) | `bullets`: Liste aus Strings oder `[Text, Ebene]` (Ebene 0 oder 1) |
| `code` | Folie 160 (Titel + Code) | `code`: String, Zeilenumbrüche mit `\n` |
| `exercise` | Folie 258 (Übungsfolie) | `bullets`: Aufgabenzeilen; letzte Zeile „Musterlösung: <Ordner> (baut auf <Vorgänger> auf)“ |
| `divider` | Folie 269 (Kapitel-Trenner, grün) | nur `title` |

### Grenzen pro Folie (damit nichts überläuft)
- `content`/`exercise`: höchstens 9 Zeilen, höchstens ca. 95 Zeichen pro Zeile. Lieber auf zwei Folien aufteilen (Titel „… (1/2)“, „… (2/2)“).
- `code`: höchstens 18 Zeilen, höchstens ca. 90 Zeichen pro Zeile.
- Keine Tabellen: Tabellen als Aufzählung umformulieren („Kriterium: Aussage“).
- Keine Emojis. Anführungszeichen im Deck: deutsche „…“ im Fließtext.

## Sprechtexte (`notes`) – Stil der bestehenden Folien

Die Notizen unter den Folien sind **Sprechtexte für eine Gebärdensprachdolmetscherin**, die einen Teilnehmer unterstützt. Der Trainer bzw. die Dolmetscherin liest oder erklärt damit die Folie. Bestehende Beispiele (Originalfolien 85, 129, 160, 255, 256):

- Beginn: `Folie: „<Titel>“.` bei Inhaltsfolien, `Codefolie „<Titel>“.` bei Codefolien, `Kapitelübergangsfolie „<Titel>“ – …` bei Trennern; bei Übungen: `Folie: „Übung N: …“.` + Leerzeile + `Erklärung für die Dolmetscherin:` + Zeilenumbruch + Erklärung.
- Dann ein bis drei Absätze **in ganzen, einfachen deutschen Sätzen**, ohne Telegrammstil.
- **Fachbegriffe und Codebezeichner in „…“** und beim ersten Auftreten kurz in einfachen Worten erklärt (z. B. „‚computed‘ ist ein berechneter Wert, der sich automatisch neu berechnet, wenn sich ein Wert ändert, den er liest“).
- Code wird nicht Zeichen für Zeichen vorgelesen, sondern sinngemäß beschrieben: was passiert, was ist das Ergebnis, warum macht man es so.
- Englische Begriffe, die schwer zu gebärden oder auszusprechen sind, kurz umschreiben.
- Keine Abkürzungen ohne Erklärung, keine Redewendungen oder Ironie, die sich schlecht übersetzen lassen.
- Länge: 3–8 Sätze pro Folie; Übungsfolien 3–6 Sätze.
- Absätze mit Leerzeile trennen (`\n\n`).

## Hinweise
- Dateiname: `content_<kurzname>.json`, gültiges JSON (UTF-8, keine Kommentare).
- Jede Folie soll eigenständig verständlich sein; Fachwörter, die im Kurs schon vorkamen, trotzdem kurz einordnen.

## Diagramme und Code-Kästen (`diagram`, nur bei `type: content`)
Eine Inhaltsfolie kann ein Feld `"diagram"` haben. Die Aufzählung steht dann links, rechts erscheint eine Grafik aus PowerPoint-Formen (siehe `diagrams.py`). Arten (`kind`):

- `flow`: `{"steps": ["A","B","C"], "highlight_last": true, "note": "…"}` (2–6 Kästen mit Pfeilen)
- `layers`: `{"layers": ["oben","mitte","unten"], "note": "…"}` (2–6 Schichten)
- `tree`: `{"root": "Eltern", "children": ["A","B","C"]}` (2–6 Kinder)
- `compare`: `{"left": {"title": "…", "items": ["…"]}, "right": {…}}` (zwei Spalten)
- `cycle`: `{"steps": ["A","B","C","D"]}` (3–4 Schritte im Kreis)
- `code`: `{"title": "Datei", "text": "Zeile 1\nZeile 2"}` (höchstens 16 Zeilen, etwa 34 Zeichen pro Zeile)

Kurze Texte verwenden (höchstens etwa 30 Zeichen pro Kasten). Ein Diagramm ersetzt nicht den Sprechtext: Der Sprechtext sollte es kurz beschreiben.
