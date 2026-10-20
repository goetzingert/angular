// TypeScript-Übung 2: Funktionen typisieren
//
// Schreibe die vier Funktionen. Jeder Parameter und jeder Rückgabewert bekommt einen Typ.
//   npm start -- src/uebung-2-funktionen.ts

interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  city?: string;
  discontinued?: boolean;
}

const customers: Customer[] = [
  { id: "1", firstname: "Lisa", lastname: "Simpson", city: "Springfield" },
  { id: "2", firstname: "Hans", lastname: "Maulwurf", city: "Springfield", discontinued: true },
  { id: "3", firstname: "Ned", lastname: "Flanders" },
];

// Aufgabe 1: Vor- und Nachname mit Leerzeichen, z. B. "Lisa Simpson"
function fullName(customer: Customer): string {
  throw new Error("TODO");
}

// Aufgabe 2: alle Kunden, deren Vorname den Text enthält (Groß-/Kleinschreibung egal)
// Tipp: Array-Methode filter
function filterCustomers(customers: Customer[], text: string): Customer[] {
  throw new Error("TODO");
}

// Aufgabe 3: die Stadt des Kunden, oder "unbekannt" (Standardwert für den zweiten Parameter)
function cityOf(customer: Customer /* , fallback ... */): string {
  throw new Error("TODO");
}

// Aufgabe 4: alle vollständigen Namen als eine Zeile, getrennt durch das erste Argument
// Tipp: Rest-Parameter (...) und die Array-Methoden map und join
function joinNames(separator: string /* , ...customers ... */): string {
  throw new Error("TODO");
}

console.log(fullName(customers[0]));
console.log(filterCustomers(customers, "li").map(fullName));
console.log(cityOf(customers[2]), cityOf(customers[2], "Ogdenville"));
console.log(joinNames(" | ", ...customers));

// Macht die Datei zu einem Modul: Namen aus anderen Übungsdateien stören nicht.
export {};
