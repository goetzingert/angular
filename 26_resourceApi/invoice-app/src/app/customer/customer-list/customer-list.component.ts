import { Component, output, signal } from '@angular/core';
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

  customerSelected = output<Customer>();
  selectedCustomer = signal<Customer | undefined>(undefined);

  listItemClicked(event: MouseEvent, cust: Customer) {
    this.selectedCustomer.set(cust);
    this.customerSelected.emit(cust);
  }

  isSelectedCustomer(cust: Customer) {
    return cust === this.selectedCustomer();
  }
}
