import { Component, OnInit } from '@angular/core';
import { Customer } from '../customer.model';

@Component({
  selector : 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customers : Customer[];
  constructor(){
    this.customers = [new Customer("Silke", "Mueller"), new Customer("Hans", "Meyer", "Hauptstraße 21", "11111", "Teststadt")];
  }
  
  ngOnInit(): void {
  }

}
