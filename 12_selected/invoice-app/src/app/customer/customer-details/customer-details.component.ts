import { Component, input, OnInit } from '@angular/core';
import { Customer } from '../customer.model';

@Component({
  standalone: true,
  selector: 'customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  customer = input<Customer | undefined>();

  constructor() { }

  ngOnInit(): void {
  }

}
