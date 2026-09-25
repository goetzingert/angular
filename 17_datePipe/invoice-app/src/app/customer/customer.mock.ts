import { Customer } from "./customer.model";

let day = new Date().getDate();
let month = new Date().getMonth();
let year = new Date().getFullYear();
export let customerMockList = [ new Customer("Silke", "Mueller", undefined, undefined, undefined, "/assets/images/customer/marge.jpg", false, new Date(year, month, day-3))
    , new Customer("Hans", "Meyer", "Hauptstraße 21", "11111", "Teststadt", "/assets/images/customer/homer.jpg", true,new Date(year, month-1, day))];
