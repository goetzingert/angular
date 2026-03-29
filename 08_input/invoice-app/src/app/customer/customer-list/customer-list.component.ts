import { Component, input, OnInit } from '@angular/core';
import { Customer } from '../customer.model';

@Component({
  selector : 'customer-list',
  standalone: true,
  imports: [],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customers = input<Customer[]>([]);
  
  constructor(){
    
  }
  
  ngOnInit(): void {
  }

}
