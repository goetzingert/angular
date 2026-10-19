// TypeScript-Übung 3: Objekte und Listen, ohne sie zu verändern
//
// In Angular werden Daten nicht verändert, sondern durch neue Objekte und Listen ersetzt.
// Schreibe die Funktionen so, dass die ursprüngliche Liste unverändert bleibt.
//   npm start -- src/uebung-3-objekte.ts

interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  city?: string;
}

const customers: Customer[] = [
  { id: "1", firstname: "Lisa", lastname: "Simpson", city: "Springfield" },
  { id: "2", firstname: "Hans", lastname: "Maulwurf" },
];

// Aufgabe 1: neue Liste, in der der Kunde mit der Kennung `id` den neuen Vornamen hat
// Tipp: map und der Spread-Operator { ...customer, firstname }
function renameCustomer(customers: Customer[], id: string, firstname: string): Customer[] {
  throw new Error("TODO");
}

// Aufgabe 2: neue Liste mit einem zusätzlichen Kunden am Ende
// Tipp: [...customers, customer]
function addCustomer(customers: Customer[], customer: Customer): Customer[] {
  throw new Error("TODO");
}

// Aufgabe 3: Text wie "Maulwurf, Hans (unbekannt)". Zerlege den Parameter direkt in der
// Signatur (Destructuring) und gib `city` den Standardwert "unbekannt". Nutze einen Template-String.
function describe(customer: Customer): string {
  throw new Error("TODO");
}

const renamed = renameCustomer(customers, "2", "Ned");
const extended = addCustomer(renamed, { id: "3", firstname: "Lisa", lastname: "Flanders" });

console.log(customers[1].firstname, renamed[1].firstname);   // Original unverändert?
console.log(customers.length, extended.length);
console.log(extended.map(describe));

// Macht die Datei zu einem Modul: Namen aus anderen Übungsdateien stören nicht.
export {};
