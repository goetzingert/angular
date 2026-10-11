import { Component, computed, effect, output, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Customer } from '../customer.model';
import { CustomerFilterComponent } from '../customer-filter/customer-filter.component';
import { CustomerListItemComponent } from '../customer-list-item/customer-list-item.component';

interface ResponseArray {
  data: Customer[];
}

const FILTER_STORAGE_KEY = 'customerFilter';

// localStorage kann fehlen oder gesperrt sein (z. B. privater Modus), deshalb try/catch.
function loadFilter(): string {
  try {
    return localStorage.getItem(FILTER_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function saveFilter(text: string): void {
  try {
    localStorage.setItem(FILTER_STORAGE_KEY, text);
  } catch {
    // ignorieren: Persistenz ist nur eine Annehmlichkeit
  }
}

@Component({
  selector: 'customer-list',
  standalone: true,
  imports: [CustomerFilterComponent, CustomerListItemComponent],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent {

  private readonly customerResource = httpResource<ResponseArray>(() => 'api/customer');

  // Lokaler Zustand: zusätzlich hinzugefügte Demo-Kunden (siehe addDemo).
  demoCustomers = signal<Customer[]>([]);

  // Abgeleiteter Zustand: computed statt Methode. Wird nur neu berechnet, wenn sich
  // die Resource oder die Demo-Kunden ändern, und nicht bei jeder Change Detection.
  customers = computed(() => [...(this.customerResource.value()?.data ?? []), ...this.demoCustomers()]);
  isLoading = this.customerResource.isLoading;
  error = this.customerResource.error;

  // Startwert aus dem Browser-Speicher wiederherstellen
  filterText = signal(loadFilter());

  customerSelected = output<Customer>();
  selectedCustomer = signal<Customer | undefined>(undefined);

  filteredCustomers = computed(() => {
    const filter = this.filterText().toLowerCase();
    if (!filter) {
      return this.customers();
    }
    return this.customers().filter(c => c.firstname?.toLowerCase().includes(filter));
  });

  selectedName = computed(() => this.selectedCustomer()?.firstname ?? '');
  total = computed(() => this.filteredCustomers().length);

  constructor() {
    // Legitimer effect: eine Nebenwirkung außerhalb von Angular (Browser-Speicher).
    // Er schreibt in KEIN Signal, sondern nur nach außen.
    effect(() => saveFilter(this.filterText()));
  }

  onFilterChanged(text: string) {
    this.filterText.set(text);
  }

  onFilterCleared() {
    this.filterText.set('');
  }

  listItemClicked(cust: Customer) {
    this.selectedCustomer.set(cust);
    this.customerSelected.emit(cust);
  }

  isSelectedCustomer(cust: Customer) {
    return cust === this.selectedCustomer();
  }

  // Änderung des Zustands über eine NEUE Referenz (update mit Spread), nicht per push.
  addDemo() {
    this.demoCustomers.update(list => [...list, new Customer('Neu', 'Demo')]);
  }
}
