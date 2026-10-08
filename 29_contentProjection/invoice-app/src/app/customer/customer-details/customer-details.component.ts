import { Component, effect, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Customer } from '../customer.model';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'customer-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage, CardComponent],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent {

  id = input<string>();

  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  // rxResource lädt den Kunden reaktiv neu, sobald sich id() ändert.
  // Das ersetzt den bisherigen effect() + getCustomerById()-Aufruf.
  private readonly customerResource = rxResource<Customer | undefined, string | undefined>({
    params: () => this.id(),
    stream: ({ params }) => {
      if (!params) {
        throw new Error('Keine Customer-Id angegeben');
      }
      return this.customerService.getById(params);
    }
  });

  customer = this.customerResource.value;
  isLoading = this.customerResource.isLoading;

  public customerForm = this.fb.group({
    firstname: [''],
    lastname: [''],
    street: [''],
    city: [''],
    zip: [''],
    lastOrderDate: [new Date().toISOString().substring(0, 10)],
  });

  constructor() {
    effect(() => {
      const currentCustomer = this.customer();
      if (currentCustomer) {
        this.customerForm.patchValue(currentCustomer as any);
        this.customerForm.patchValue({ lastOrderDate: currentCustomer.lastOrderDate?.toISOString().substring(0, 10) });
      }
    });
  }

  onSubmit(): void {
    const currentCustomer = this.customer();
    if (currentCustomer && this.customerForm.valid) {
      const updatedCustomer: Customer = {
        ...currentCustomer,
        ...this.customerForm.value
      } as Customer;

      if (this.customerForm.value.lastOrderDate) {
        updatedCustomer.lastOrderDate = new Date(this.customerForm.value.lastOrderDate);
      }

      this.customerService.update(updatedCustomer).subscribe(() => {
        this.goBack();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/customer']);
  }

}
