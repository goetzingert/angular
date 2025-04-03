import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Customer } from '../customer.model';

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  @Input()
  customers: Customer[] = [];

  @Output() customerSelected: EventEmitter<Customer> = new EventEmitter<Customer>();
  selectedCustomer: Customer | undefined;


  constructor() {

  }

  ngOnInit(): void {
  }

  listItemClicked(event: MouseEvent, cust: Customer) {
    this.selectedCustomer = cust;
    this.customerSelected.emit(this.selectedCustomer);
  }

}
