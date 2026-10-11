import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from '../customer.model';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'customer-details',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent {

  id = input<string>();

  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);

  // Der geladene Kunde (nur lesen!). Hier kommt er synchron aus dem Mock-Service.
  customer = computed(() => {
    const id = this.id();
    return id ? this.customerService.getById(id) : undefined;
  });

  // Bearbeitbare Kopie für das Formular. Ändert sich der geladene Kunde, wird die Kopie neu erzeugt.
  // So bearbeitet ngModel nie direkt das geladene Objekt.
  draft = linkedSignal(() => {
    const customer = this.customer();
    return customer ? { ...customer } : undefined;
  });

  // <input type="date"> liefert einen String ('yyyy-MM-dd'), das Modell hält ein Date.
  setLastOrderDate(customer: Customer, value: string): void {
    customer.lastOrderDate = value ? new Date(value) : undefined;
  }

  goBack(): void {
    this.router.navigate(['/customer']);
  }

}
