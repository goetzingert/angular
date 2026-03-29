import { Component, inject } from '@angular/core';
import { Customer } from './customer/customer.model';
import { CustomerService } from './customer/customer.service';
import { toSignal } from '@angular/core/rxjs-interop';
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
  private customerService = inject(CustomerService);
  public customerMockList = toSignal(this.customerService.getAll(), { initialValue: [] as Customer[] });
  
  constructor(){}

  newCustomerSelected(selectedCustomer : Customer){
    this.selectedCustomer = selectedCustomer;
    console.log(selectedCustomer);
  }
}
