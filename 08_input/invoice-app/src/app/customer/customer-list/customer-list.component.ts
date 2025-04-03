import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '../customer.model';

@Component({
  selector : 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  @Input()
  customers : Customer[] = [];
  constructor(){
    
  }
  
  ngOnInit(): void {
  }

}
