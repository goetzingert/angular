// TypeScript-Übung 5: Module
//
// Lagere die Klasse `Customer` in ein eigenes Modul aus:
//   1. Lege die Datei src/customer.ts an, verschiebe die Klasse dorthin und exportiere sie (export).
//   2. Importiere sie hier: import { Customer } from "./customer";
//   3. Führe dieses Programm aus:  npm start -- src/uebung-5-module.ts
// Zusatz: Exportiere auch das Interface `Labelled` und importiere beide Namen.

interface Labelled {
  getLabel(): string;
}

class Customer implements Labelled {
  constructor(
    public firstname: string,
    public lastname: string,
  ) {}

  getLabel(): string {
    return `Kunde: ${this.firstname} ${this.lastname}`;
  }
}

const customer = new Customer("Lisa", "Simpson");
console.log(customer.getLabel());
