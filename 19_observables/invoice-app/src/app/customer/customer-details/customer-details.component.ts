import { Component, input, OnInit } from '@angular/core';
import { Customer } from '../customer.model';
import { DatePipe } from '@angular/common';
import { CurrentActiveCustomersPipe } from '../current-active-customers-pipe';

@Component({
  selector: 'customer-details',
  standalone: true,
  imports: [DatePipe, CurrentActiveCustomersPipe],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  public customer = input<Customer | undefined>();

  constructor() { }

  ngOnInit(): void {
  }

}
