import { Injectable } from '@angular/core';
import { customerMockList } from './customer.mock';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor() { }

  public getAll() : Customer[]{
    return customerMockList;
  }
}
