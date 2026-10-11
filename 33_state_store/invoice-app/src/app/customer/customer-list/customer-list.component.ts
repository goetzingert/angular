import { Component, OnInit, inject, output } from '@angular/core';
import { Customer } from '../customer.model';
import { CustomerStore } from '../customer.store';
import { CustomerFilterComponent } from '../customer-filter/customer-filter.component';
import { CustomerListItemComponent } from '../customer-list-item/customer-list-item.component';

// Container-Komponente ohne eigene Zustandslogik: Sie liest Signals aus dem Store
// und ruft dessen Methoden auf.
@Component({
  selector: 'customer-list',
  standalone: true,
  imports: [CustomerFilterComponent, CustomerListItemComponent],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  protected readonly store = inject(CustomerStore);

  customerSelected = output<Customer>();

  ngOnInit(): void {
    this.store.load();
  }

  onFilterChanged(text: string) {
    this.store.setFilter(text);
  }

  onFilterCleared() {
    this.store.setFilter('');
  }

  listItemClicked(cust: Customer) {
    this.store.select(cust.id);
    this.customerSelected.emit(cust);
  }

  isSelectedCustomer(cust: Customer) {
    return cust.id === this.store.selectedId();
  }

  addDemo() {
    this.store.addDemo();
  }
}
