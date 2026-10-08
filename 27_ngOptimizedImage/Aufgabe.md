# Übung 27: NgOptimizedImage

## Aufgabe

Stelle die Bilddarstellung von einem normalen `<img [src]>` auf die eingebaute Performance-Direktive `NgOptimizedImage` um.

1. Importiere `NgOptimizedImage` aus `@angular/common` im `imports`-Array von `CustomerDetailsComponent`.
2. Ersetze `[src]="customer()?.imageUrl"` durch `[ngSrc]="customer()!.imageUrl!"`.
3. Ergänze die Pflichtangaben `width` und `height` (oder alternativ `fill` mit einem positionierten Elternelement), damit der Browser schon vor dem Laden des Bildes den passenden Platz reservieren kann (verhindert Layout-Verschiebungen, sog. "Cumulative Layout Shift").
4. Teste im Browser, dass die Bilder weiterhin korrekt angezeigt werden.
5. Optional: Setze `priority` auf ein Bild, das "above the fold" (sofort sichtbar) ist, um dem Browser eine höhere Ladepriorität zu signalisieren.

## Lernziele

- Du kennst die eingebaute Direktive `NgOptimizedImage` und ihren Performance-Vorteil gegenüber einem normalen `<img [src]>`.
- Du weißt, warum `width`/`height` (oder `fill`) bei `NgOptimizedImage` Pflicht sind.
- Du kannst mit `priority` einzelne, besonders wichtige Bilder (z. B. den Hauptinhalt "above the fold") bevorzugt laden lassen.
- Du verstehst den Unterschied zwischen einer normalen Angular-Direktive (`[src]`) und einer speziell für Performance optimierten Variante.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Die Direktive heißt `NgOptimizedImage`, das Attribut im Template lautet `ngSrc` (nicht `src`!) – Angular übernimmt dann intern das eigentliche Setzen des `src`-Attributs inklusive Optimierungen.
- Ohne `width`/`height` (bzw. `fill`) wirft Angular zur Laufzeit einen Fehler – das ist bewusst so, damit Layout-Verschiebungen von Anfang an vermieden werden.
- `NgOptimizedImage` funktioniert auch ohne einen externen Bild-Loader (z. B. Cloudinary/Imgix) – dann werden lediglich Lazy Loading, automatische `srcset`-Generierung (falls Loader vorhanden) und Warnungen bei fehlenden Best-Practices aktiv.
- `priority` sollte sparsam verwendet werden – nur für das visuell wichtigste Bild der Seite (typischerweise maximal ein Bild pro Seite).
