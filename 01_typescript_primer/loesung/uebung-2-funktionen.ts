// TypeScript-Übung 2: Musterlösung

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

function fullName(customer: Customer): string {
  return customer.firstname + " " + customer.lastname;
}

function filterCustomers(customers: Customer[], text: string): Customer[] {
  return customers.filter(c => c.firstname.toLowerCase().includes(text.toLowerCase()));
}

function cityOf(customer: Customer, fallback = "unbekannt"): string {
  return customer.city ?? fallback;
}

function joinNames(separator: string, ...customers: Customer[]): string {
  return customers.map(fullName).join(separator);
}

console.log(fullName(customers[0]));
console.log(filterCustomers(customers, "li").map(fullName));
console.log(cityOf(customers[2]), cityOf(customers[2], "Ogdenville"));
console.log(joinNames(" | ", ...customers));

// Macht die Datei zu einem Modul: Namen aus anderen Übungsdateien stören nicht.
export {};
