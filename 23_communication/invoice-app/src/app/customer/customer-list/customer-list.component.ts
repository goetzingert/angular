import { Component, inject, OnInit, output } from '@angular/core';
import { Customer } from '../customer.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { CustomerService } from '../customer.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'customer-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {


  private readonly customerService = inject(CustomerService);
  customers = toSignal(this.customerService.getAll(), { initialValue: [] });

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
