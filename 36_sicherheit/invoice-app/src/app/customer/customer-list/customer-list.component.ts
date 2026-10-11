import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { debounceTime } from 'rxjs';
import { Customer } from '../customer.model';
import { CustomerStore } from '../customer.store';
import { CustomerFilterComponent } from '../customer-filter/customer-filter.component';
import { CustomerListItemComponent } from '../customer-list-item/customer-list-item.component';

// Container-Komponente ohne eigene Zustandslogik: Sie liest Signals aus dem Store
// und ruft dessen Methoden auf.
@Component({
  selector: 'customer-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollingModule, CustomerFilterComponent, CustomerListItemComponent],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent {

  protected readonly store = inject(CustomerStore);

  // Das Eingabefeld zeigt sofort, was getippt wurde. Der Store (und damit die teure
  // Neuberechnung der Liste) bekommt den Text erst nach 250 ms Tipp-Pause.
  protected readonly typedFilter = signal(this.store.filter());

  customerSelected = output<Customer>();

  constructor() {
    this.store.load();
    toObservable(this.typedFilter).pipe(
      debounceTime(250),
      takeUntilDestroyed()
    ).subscribe(text => this.store.setFilter(text));
  }

  // trackBy für cdkVirtualFor: stabile ID statt Objektidentität
  protected readonly trackById = (_index: number, customer: Customer) => customer.id;

  onFilterChanged(text: string) {
    this.typedFilter.set(text);
  }

  onFilterCleared() {
    // Leeren wirkt sofort, ohne Wartezeit
    this.typedFilter.set('');
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
