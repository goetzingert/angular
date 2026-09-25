# Übung 11: Bindings auf Images und mehr

## Aufgabe

Erweitere das Datenmodell und zeige zusätzlich ein Bild pro Kunde an.

1. Füge der Klasse `Customer` eine optionale Eigenschaft `imageUrl: string` hinzu (auch im Konstruktor als Parameter).
2. Kopiere aus der Musterlösung die Bilddateien aus `src/assets/images/customer` (oder lege eigene Bilder in einem passenden Assets-Ordner ab).
3. Binde in der Detail- oder Listendarstellung ein `<img>`-Element per Property Binding an die neue Eigenschaft, z. B. `[src]="customer.imageUrl"`.
4. Optional (fortgeschritten): Lade die Detail-Komponente per `@defer (on idle)` mit einem `@placeholder`, statt sie sofort mitzuladen.

## Lernziele

- Du kannst beliebige HTML-Element-Eigenschaften (nicht nur Angular-spezifische Attribute) per Property Binding dynamisch setzen.
- Du weißt, wie man ein optionales Feld im Datenmodell ergänzt, ohne bestehenden Code zu brechen.
- (Optional) Du hast eine erste Deferrable View mit `@defer` ausprobiert.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Die Syntax für Property Binding auf normale HTML-Attribute ist identisch zu Angular-Inputs: `[src]="ausdruck"`.
- Achte auf den Pfad zu den Bilddateien – Assets müssen im `assets`-Ordner liegen, damit sie beim Build mitkopiert werden.
- Beim optionalen `@defer`-Teil reicht ein einfacher `@placeholder`-Text wie „Lade Kundendetails…“ als Platzhalter.
