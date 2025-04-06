import { Component } from '@angular/core';
import { Customer } from './customer/customer.model';
import { CustomerService } from './customer/customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invoice-app';

  public selectedCustomer: Customer | undefined;
  customerMockList: Customer[] = [];
  
  constructor(private readonly customerService: CustomerService){
    this.customerMockList = this.customerService.getAll();}

  newCustomerSelected(selectedCustomer : Customer){
    this.selectedCustomer = selectedCustomer;
    console.log(selectedCustomer);
  }
}
