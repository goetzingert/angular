import { Component, effect, inject, input, OnInit } from '@angular/core';
import { Customer } from '../customer.model';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'customer-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  id = input<string>();
  customer: Customer | undefined;

  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

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
      const currentId = this.id();
      if (currentId) {
        this.getCustomerById(currentId);
      }
    });
  }


  ngOnInit(): void {
  }
  getCustomerById(id: string) {
    this.customerService.getById(id).subscribe(customer => {
      this.customer = customer;
      if (this.customer) {
        console.log("Patch it", this.customer);
        this.customerForm.patchValue(this.customer as any);
        this.customerForm.patchValue({ lastOrderDate: this.customer.lastOrderDate?.toISOString().substring(0, 10) });
      }
    });
  }

  onSubmit(): void {
    if (this.customer && this.customerForm.valid) {
      const updatedCustomer: Customer = {
        ...this.customer,
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
