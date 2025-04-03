import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '../customer.model';

@Component({
  selector: 'customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  @Input() public customer : Customer | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
