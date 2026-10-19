// TypeScript-Übung 1: Typfehler beheben
//
// Dieses Programm enthält absichtlich 6 Fehler. `npm run check` (oder der Editor) zeigt sie an.
// Behebe alle Fehler, ohne `any` zu verwenden. Danach muss das Programm laufen:
//   npm start -- src/uebung-1-typfehler.ts

const firstname: string = "Lisa";
const age: number = "42";                         // Fehler 1
let city: string = undefined;                     // Fehler 2
const lastname = "Simpson";
lastname = "Flanders";                            // Fehler 3

function fullName(first: string, last: string): string {
  return first + " " + last;
}

console.log(fullName(firstname));                 // Fehler 4
console.log(fullName(firstname, 42));             // Fehler 5

const customer = { firstname: "Hans", lastname: "Maulwurf" };
console.log(customer.city.toUpperCase());         // Fehler 6

console.log(age, city, lastname);

// Macht die Datei zu einem Modul: Namen aus anderen Übungsdateien stören nicht.
export {};
