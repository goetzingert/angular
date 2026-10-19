// TypeScript-Übung 3: Musterlösung

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

function renameCustomer(customers: Customer[], id: string, firstname: string): Customer[] {
  return customers.map(c => (c.id === id ? { ...c, firstname } : c));
}

function addCustomer(customers: Customer[], customer: Customer): Customer[] {
  return [...customers, customer];
}

function describe({ firstname, lastname, city = "unbekannt" }: Customer): string {
  return `${lastname}, ${firstname} (${city})`;
}

const renamed = renameCustomer(customers, "2", "Ned");
const extended = addCustomer(renamed, { id: "3", firstname: "Lisa", lastname: "Flanders" });

console.log(customers[1].firstname, renamed[1].firstname);
console.log(customers.length, extended.length);
console.log(extended.map(describe));

// Macht die Datei zu einem Modul: Namen aus anderen Übungsdateien stören nicht.
export {};
