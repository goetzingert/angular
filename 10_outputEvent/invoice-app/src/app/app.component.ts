import { Component } from '@angular/core';
import { Customer } from './customer/customer.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invoice-app';

  public selectedCustomer: Customer | undefined;
  
  public customerMockList : Customer[];
  constructor(){
    this.customerMockList =[new Customer("Silke", "Mueller"), new Customer("Hans", "Meyer", "Hauptstraße 21", "11111", "Teststadt")];

  }

  newCustomerSelected(selectedCustomer : Customer){
    this.selectedCustomer = selectedCustomer;
    console.log(selectedCustomer);
  }
}
