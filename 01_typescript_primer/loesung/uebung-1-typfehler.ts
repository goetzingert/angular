// TypeScript-Übung 1: Musterlösung

const firstname: string = "Lisa";
const age: number = 42;                           // 1: Zahl statt Text
let city: string | undefined = undefined;         // 2: "kein Wert" gehört in den Typ
let lastname = "Simpson";                         // 3: let, wenn sich der Wert ändert
lastname = "Flanders";

function fullName(first: string, last: string): string {
  return first + " " + last;
}

console.log(fullName(firstname, lastname));       // 4: beide Parameter übergeben
console.log(fullName(firstname, "Simpson"));      // 5: Text statt Zahl

// 6: city ist optional und wird mit ?. und ?? abgesichert
const customer: { firstname: string; lastname: string; city?: string } = {
  firstname: "Hans",
  lastname: "Maulwurf",
};
console.log(customer.city?.toUpperCase() ?? "UNBEKANNT");

console.log(age, city, lastname);

// Macht die Datei zu einem Modul: Namen aus anderen Übungsdateien stören nicht.
export {};
