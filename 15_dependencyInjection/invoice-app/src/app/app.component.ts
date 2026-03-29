import { Component, inject } from '@angular/core';
import { Customer } from './customer/customer.model';
import { CustomerService } from './customer/customer.service';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomerListComponent, CustomerDetailsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invoice-app';

  public selectedCustomer: Customer | undefined;
  customerMockList: Customer[] = [];

  private readonly customerService = inject(CustomerService);

  constructor(){
    this.customerMockList = this.customerService.getAll();
  }

  newCustomerSelected(selectedCustomer : Customer){
    this.selectedCustomer = selectedCustomer;
    console.log(selectedCustomer);
  }
}
