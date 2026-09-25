import { Component, signal } from '@angular/core';
import { Customer } from './customer/customer.model';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerDetailsComponent } from "./customer/customer-details/customer-details.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomerListComponent, CustomerDetailsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invoice-app';

  public selectedCustomer = signal<Customer | undefined>(undefined);

  public customerMockList : Customer[];
  constructor(){
    this.customerMockList =[new Customer("Silke", "Mueller",undefined,undefined, undefined, "/assets/images/customer/marge.jpg"), new Customer("Hans", "Meyer", "Hauptstraße 21", "11111", "Teststadt","/assets/images/customer/homer.jpg")];

  }

  newCustomerSelected(selectedCustomer : Customer){
    this.selectedCustomer.set(selectedCustomer);
    console.log(selectedCustomer);
  }
}
