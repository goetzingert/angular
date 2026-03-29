import {Injectable} from '@angular/core';
import {CUSTOMER1, CUSTOMER2, CUSTOMER3} from './customer.mock';
import {Customer} from './customer.model';
import {Observable, ReplaySubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class CustomerService {

  customerSubject: ReplaySubject<Customer[]>;

  constructor() {
    this.customerSubject = new ReplaySubject<Customer[]>()
  }


  public getAll(): Observable<Customer[]> {
    setTimeout(() => {
      this.customerSubject.next([CUSTOMER1]);
    }, 3000);
    setTimeout(() => {
      this.customerSubject.next([CUSTOMER1, CUSTOMER2]);
    }, 5000);
    setTimeout(() => {
      this.customerSubject.next([CUSTOMER1, CUSTOMER2, CUSTOMER3]);
    }, 8000);
    return this.customerSubject.asObservable();
  }
}
