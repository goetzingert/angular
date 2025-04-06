import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Customer } from '../customer.model';
import { Observable, Subscription } from 'rxjs';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {


  @Input()
  customers: Customer[] | null = [];

  @Output() customerSelected: EventEmitter<Customer> = new EventEmitter<Customer>();
  selectedCustomer: Customer | undefined;
  customerSubscription: Subscription | undefined;
  customerObservable: Observable<Customer[]> | undefined;


  constructor(private readonly customerService: CustomerService) {
  }

  ngOnInit(): void {
    this.customerObservable = this.customerService.getAll();
    this.customerSubscription = this.customerObservable?.subscribe((data) => {
      this.customers = data;
    });

  }

  ngOnDestroy(): void {
    this.customerSubscription?.unsubscribe();
  }

  listItemClicked(event: MouseEvent, cust: Customer) {
    this.selectedCustomer = cust;
    this.customerSelected.emit(this.selectedCustomer);
  }
  isSelectedCustomer(cust: Customer) {
    return cust === this.selectedCustomer;
  }

}
