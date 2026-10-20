// TypeScript-Übung 4: Die Klasse Customer
//
// Baue die Klasse so, wie sie später in der Invoice-App (customer.model.ts) gebraucht wird.
//   npm start -- src/uebung-4-klassen.ts

interface Labelled {
  getLabel(): string;
}

// Aufgabe 1: Klasse `Customer` mit
//   - den Attributen firstname, lastname (Text) und city (optionaler Text),
//     deklariert über "Parameter properties" im Konstruktor,
//   - einem Attribut `id`, das im Konstruktor mit crypto.randomUUID() gesetzt wird,
//   - einem Getter `fullName` ("Vorname Nachname"),
//   - einer Methode getLabel(), die "Kunde: <fullName> (<city oder 'unbekannt'>)" liefert.
// Aufgabe 2: Die Klasse soll das Interface `Labelled` implementieren.
// Aufgabe 3: Klasse `VipCustomer extends Customer` mit zusätzlichem Attribut `discount` (Zahl).
//   Ihre getLabel() ergänzt den Text der Oberklasse (super.getLabel()) um " - VIP -<discount>%".

// (hier die Klassen schreiben)

// const lisa = new Customer("Lisa", "Simpson", "Springfield");
// const ned = new VipCustomer("Ned", "Flanders", 10);
// console.log(lisa.fullName);
// console.log(lisa.getLabel());
// console.log(ned.getLabel());
// console.log(lisa.id === ned.id);

// Macht die Datei zu einem Modul: Namen aus anderen Übungsdateien stören nicht.
export {};
