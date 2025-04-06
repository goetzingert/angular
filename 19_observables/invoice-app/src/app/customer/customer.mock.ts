import { Customer } from "./customer.model";

// Mock data for customer list
// This data is used to simulate a backend API response
// and is not meant to be used in production code.
// The data includes a list of customers with their details

let day = new Date().getDate();
let month = new Date().getMonth();
let year = new Date().getFullYear();
export const CUSTOMER1 = new Customer("Silke", "Mueller", undefined, undefined, undefined, "/assets/images/customer/marge.jpg", false, new Date(year, month, day-3));
export const CUSTOMER2 = new Customer("Hans", "Meyer", "Hauptstraße 21", "11111", "Teststadt", "/assets/images/customer/homer.jpg", true, new Date(year, month-1, day));
export const CUSTOMER3 = new Customer("Peter", "Schmidt", "Vorderweg 32", "3333", "Linden", "/assets/images/customer/homer.jpg", true, new Date(year, month, day-4));


export let customerMockList = [ CUSTOMER1
    , CUSTOMER2, CUSTOMER3];
