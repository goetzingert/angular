import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../customer.model';

@Component({
  selector: 'customer-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  customer = input<Customer | undefined>();

  constructor() { }

  ngOnInit(): void {
  }

}
