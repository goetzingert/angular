import { Component, input, OnInit, output } from '@angular/core';
import { Customer } from '../customer.model';
import { CurrentActiveCustomersPipe } from '../current-active-customers-pipe';

@Component({
  selector: 'customer-list',
  standalone: true,
  imports: [CurrentActiveCustomersPipe],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {


  customers = input<Customer[]>([]);

  customerSelected = output<Customer>();
  selectedCustomer: Customer | undefined;


  constructor() {

  }

  ngOnInit(): void {
  }

  listItemClicked(event: MouseEvent, cust: Customer) {
    this.selectedCustomer = cust;
    this.customerSelected.emit(this.selectedCustomer);
  }
  isSelectedCustomer(cust: Customer) {
    return cust === this.selectedCustomer;
  }

}
