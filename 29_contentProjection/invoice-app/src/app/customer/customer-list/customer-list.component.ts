import { Component, ElementRef, output, signal, viewChild } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Customer } from '../customer.model';
import { RouterLink } from '@angular/router';

interface ResponseArray {
  data: Customer[];
}

@Component({
  selector: 'customer-list',
  standalone: true,
  imports: [RouterLink],
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

  // viewChild() liefert ein Signal auf ein Element aus dem eigenen Template.
  // Ersetzt die bisherige @ViewChild()-Dekorator-Variante.
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

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

  onFilterInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterText.set(value);
  }

  clearFilter() {
    this.filterText.set('');
    // Zugriff auf das native Element per Signal - kein statisches @ViewChild-Feld nötig.
    this.searchInput()?.nativeElement.focus();
  }

  listItemClicked(event: MouseEvent, cust: Customer) {
    this.selectedCustomer.set(cust);
    this.customerSelected.emit(cust);
  }

  isSelectedCustomer(cust: Customer) {
    return cust === this.selectedCustomer();
  }
}
