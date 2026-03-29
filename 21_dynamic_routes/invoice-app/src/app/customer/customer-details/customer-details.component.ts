import { Component, effect, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../customer.model';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'customer-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  id = input<string>();
  customer : Customer | undefined;

  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.customer = this.customerService.getById(currentId);
      }
    });
  }


  ngOnInit(): void {
  }

  goBack(): void {
    this.router.navigate(['/customer']);
  }

}
