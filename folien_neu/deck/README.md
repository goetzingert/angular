# build_deck.py – neue Folien in das Angular-21-Deck einfügen

Fügt Folien aus `content_*.json` in eine **Kopie** von `presentation_angular21.pptx` ein
(Format: siehe `SCHEMA.md`). Die Eingabedatei wird nie verändert; es wird immer von der
unveränderten Originaldatei ausgegangen, daher ist jeder Lauf wiederholbar (gleiche Eingabe = gleiche Ausgabe).

## Aufruf

```
python3 -I folien_neu/deck/build_deck.py presentation_angular21.pptx presentation_angular21_neu.pptx
python3 -I folien_neu/deck/build_deck.py <eingabe.pptx> <ausgabe.pptx> [--content-dir DIR] [--quiet]
```

Voraussetzung: Python 3, `python-pptx` (getestet mit 1.0.2). `--content-dir` ist standardmäßig der Ordner
des Skripts. Geladen werden alle `content_*.json` in alphabetischer Reihenfolge
(`content_selftest.json.example` wird bewusst nicht geladen).

## Ablauf

1. Alle `content_*.json` lesen und prüfen (Fehler: Dateiname + Position, Exit-Code 2, es wird nichts geschrieben).
2. Auswertung nach Phasen: `delete` → `move` → `edit`/`replace_text` → Einfügeblöcke.
   Alle Nummern beziehen sich auf die Originalnummerierung (1-basiert).
3. Neue Folien entstehen als Kopie der Vorlagenfolien (gleiches Layout, Schriftgrößen, Farben,
   Absatzeigenschaften): `content` = 256, `code` = 160, `exercise` = 258, `divider` = 269 (inkl. grüner Fläche und Animation).
4. Notizen (Sprechtexte) kommen in die Notizseite (Notes-Master des Decks), Absätze durch `\n\n` getrennt (Leerabsatz, wie im Original).
5. Reihenfolge wird über die `sldIdLst` aufgebaut; Ausgabe mit Zusammenfassung und Warnungen.

Beispiel-Ausgabe: `Eingefuegt 5 | verschoben 3 | geloescht 2 | editiert 1 | Textersetzung auf 1 Folie(n)`, `Gesamtfolienzahl: 312`.

## Hinweise

- Einfügeposition: `after` ist eine Originalfolie. Wird sie gelöscht, bleibt ihre Position als Anker erhalten.
  Wird sie verschoben, folgen die eingefügten Folien ihr. Mehrere Blöcke mit gleichem `after`: Sortierung nach `order`, dann Dateiname.
- Verschiebt man einen Bereich (`move`) hinter eine Folie `X` und fügt man auch hinter `X` ein, stehen die neuen Folien direkt hinter `X`, vor dem verschobenen Bereich.
- `edit` ersetzt nur die angegebenen Felder (`title`, `bullets`, `code`, `notes`); die Formatierung wird vom ersten (bzw. letzten) Text-Absatz der Folie übernommen.
  Bei Folien mit zentriertem Layout bleibt dessen vertikale Ausrichtung erhalten (neue Folien beginnen immer oben).
- `replace_text` ersetzt in allen Textfeldern (auch Tabellen/Gruppen), auch über Formatierungsgrenzen hinweg; Treffer 0 = Warnung.
- Warnungen: mehr als 9 Zeilen oder > 95 Zeichen (content/exercise), mehr als 18 Zeilen oder > 90 Zeichen (code), fehlende Notizen,
  Notizen > 3500 Zeichen, nicht gefundener Ersetzungstext, deutlich verkleinerte Schrift.
- Lange Titel: Die Schrift wird nur so weit verkleinert, wie für zwei (Divider: drei) Zeilen nötig ist; dabei erscheint eine Warnung. Bitte besser den Titel kürzen.
  Lange Aufzählungen/Code werden stufenweise verkleinert (Code mind. 10 pt), danach Warnung „bitte kürzen/teilen“.

## Inhalte ergänzen

1. Neue Datei `content_<kurzname>.json` in diesem Ordner anlegen (Format siehe `SCHEMA.md`, Beispiel `content_selftest.json.example`).
2. Skript erneut ausführen, Warnungen prüfen, Ausgabedatei in PowerPoint ansehen.

Selbsttest: `cp content_selftest.json.example /tmp/t/content_selftest.json` und mit `--content-dir /tmp/t` bauen (fügt nach Folie 267 fünf Testfolien ein, verschiebt 217-219, löscht 100-101, ändert 256 und 258).

## Bekannte Einschränkungen

- Die Vorlagenfolien setzen Größen/Schrift in den Originalen über `defRPr` des Absatzes. Neue Folien setzen sie zusätzlich explizit am Text
  (Segoe UI 36 pt fett Titel, 20/17 pt Text); die Darstellung in LibreOffice entspricht den Originalen, in PowerPoint können die Originale davon abweichen.
- Aufzählungsebenen: nur 0 und 1. Die Originale enthalten teils zusätzlich „•“ im Text (Doppel-Aufzählungspunkte); neue Folien nutzen nur die Layout-Aufzählung.
- Überlaufprüfung ist eine Schätzung (Zeichenbreite), kein echtes Rendering; im Zweifel PDF prüfen (`soffice --headless --convert-to pdf`).
- Abschnitte (`sectionLst`) werden nicht gepflegt (das Deck hat keine; sonst Warnung).
- Gelöschte Folien verschwinden samt Notizen aus der Datei; Querverweise/Hyperlinks auf Folien werden nicht angepasst.

## Wichtig: Eingabedatei ist das Original-Deck
Alle Folienverweise (`after`, `move`, `edit`) beziehen sich auf die ursprüngliche Nummerierung mit **309 Folien**. Die Datei `presentation_angular21.pptx` im Repo enthält nach dem Einbau bereits die neuen Folien (444). Wird das Werkzeug erneut benötigt (z. B. nach Änderung einer `content_*.json`), das Original aus der Git-Historie holen und als Eingabe verwenden:

```
git show baf0614:presentation_angular21.pptx > /tmp/original.pptx
python3 -I folien_neu/deck/build_deck.py /tmp/original.pptx /tmp/neu.pptx
```
Das Ergebnis ersetzt danach `presentation_angular21.pptx`. Änderungen, die direkt in PowerPoint am neuen Deck gemacht wurden, gehen dabei verloren.

## Testing-Deck (Vitest)
`testing_deck_vitest.py` stellt `Testing_angular21.pptx` von Karma/Jasmine auf Vitest um (Texte, SmartArt-Diagramme, Screenshot `testing_ng_test_ausgabe.png`, neue Folie „Umstieg von Jasmine auf Vitest“, Sprechtexte für die geänderten Folien). Eingabe ist wie beim Hauptdeck das **Original** aus der Git-Historie:

```
git show baf0614:Testing_angular21.pptx > /tmp/testing_original.pptx
python3 -I folien_neu/deck/testing_deck_vitest.py /tmp/testing_original.pptx Testing_angular21.pptx folien_neu/deck/testing_ng_test_ausgabe.png
```

## Korrekturen am TypeScript Primer (`ts_korrekturen.py`)
`ts_korrekturen.py` korrigiert die Originalfolien 1–69 (TypeScript Primer) und läuft als **Vorverarbeitung vor `build_deck.py`**, ebenfalls auf dem Original:

```
git show baf0614:presentation_angular21.pptx > /tmp/original.pptx
python3 -I folien_neu/deck/ts_korrekturen.py /tmp/original.pptx /tmp/original_korrigiert.pptx
python3 -I folien_neu/deck/build_deck.py /tmp/original_korrigiert.pptx /tmp/neu.pptx
```
Das Ergebnis ersetzt danach `presentation_angular21.pptx`. Die Korrekturen sind im Kopf des Skripts aufgelistet. Alle Code-Beispiele wurden mit dem TypeScript-Compiler (strict, 5.9) geprüft.
