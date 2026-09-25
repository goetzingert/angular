import { Component, input, OnInit, output, signal } from '@angular/core';
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
  selectedCustomer = signal<Customer | undefined>(undefined);


  constructor() {

  }

  ngOnInit(): void {
  }

  listItemClicked(event: MouseEvent, cust: Customer) {
    this.selectedCustomer.set(cust);
    this.customerSelected.emit(cust);
  }
  isSelectedCustomer(cust: Customer) {
    return cust === this.selectedCustomer();
  }

}
