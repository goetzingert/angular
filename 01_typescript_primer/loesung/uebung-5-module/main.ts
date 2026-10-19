import { Customer, type Labelled } from "./customer";

const customer: Labelled = new Customer("Lisa", "Simpson");
console.log(customer.getLabel());
