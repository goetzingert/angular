# Übung 12: Class Binding

## Aufgabe

Markiere abgemeldete bzw. inaktive Kunden visuell in der Liste.

1. Ergänze in `Customer` ein Feld `discontinued: boolean` (ebenfalls über den Konstruktor gesetzt).
2. Passe deine Mock-/Testdaten so an, dass einige Kunden `discontinued: true` haben.
3. Nutze in `CustomerListComponent` ein Class Binding, z. B. `[class.discontinued]="customer.discontinued"`, um solchen Kunden eine eigene CSS-Klasse zuzuweisen.
4. Definiere im zugehörigen CSS einen passenden visuellen Stil für die Klasse `discontinued` (z. B. ausgegraut oder durchgestrichen).

## Lernziele

- Du kannst mit Class Bindings CSS-Klassen abhängig von einem Ausdruck dynamisch setzen.
- Du verstehst den Unterschied zwischen einer statischen `class="..."`-Angabe und einem dynamischen `[class.name]="ausdruck"`.
- Du siehst, wie sich fachliche Daten (hier: ein boolescher Zustand) direkt auf die visuelle Darstellung auswirken können.

---

## Lösungshinweise

*Nur bei Bedarf lesen – falls du an einer Stelle nicht weiterkommst.*

- Die Schreibweise ist `[class.cssKlassenname]="booleanAusdruck"` – die Klasse wird nur gesetzt, wenn der Ausdruck `true` ergibt.
- Du kannst auch eine Methode statt einer einfachen Eigenschaft als Ausdruck verwenden, z. B. `isSelected(customer)`.
- Alternativ zu Class Bindings gibt es auch Style Bindings (`[style.eigenschaft]`), falls du direkt einzelne CSS-Werte statt einer ganzen Klasse setzen möchtest.
