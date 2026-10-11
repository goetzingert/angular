import { Component, output, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Customer } from '../customer.model';
import { CustomerFilterComponent } from '../customer-filter/customer-filter.component';
import { CustomerListItemComponent } from '../customer-list-item/customer-list-item.component';

interface ResponseArray {
  data: Customer[];
}

// Container-Komponente: lädt die Daten und hält Filter- und Auswahlzustand.
// Die Darstellung steckt in CustomerFilterComponent und CustomerListItemComponent.
@Component({
  selector: 'customer-list',
  standalone: true,
  imports: [CustomerFilterComponent, CustomerListItemComponent],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent {

  // httpResource lädt die Liste direkt über HttpClient und liefert
  // Signals für Wert, Ladezustand und Fehler - ganz ohne Service/ReplaySubject.
  private readonly customerResource = httpResource<ResponseArray>(() => 'api/customer');

  customers = () => this.customerResource.value()?.data ?? [];
  isLoading = this.customerResource.isLoading;
  error = this.customerResource.error;

  filterText = signal('');

  customerSelected = output<Customer>();
  selectedCustomer = signal<Customer | undefined>(undefined);

  filteredCustomers() {
    const filter = this.filterText().toLowerCase();
    if (!filter) {
      return this.customers();
    }
    return this.customers().filter(c => c.firstname?.toLowerCase().includes(filter));
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
}
