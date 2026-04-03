import { Injectable } from '@angular/core';
import { Customer } from './customer.model';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";

interface ResponseArray {
  data: Customer[];
}

interface Response {
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customerSubject: ReplaySubject<Customer[]>;

  constructor(private httpClient: HttpClient) {
    this.customerSubject = new ReplaySubject<Customer[]>();
    this.reloadData();
  }

  public reloadData(): void {
    this.httpClient.get<ResponseArray>("api/customer").pipe(
      map(object => object.data.map(customer => this.mapDates(customer)))
    ).subscribe(customers => this.customerSubject.next(customers));
  }

  public getAll(): Observable<Customer[]> {
    return this.customerSubject.asObservable();
  }

  public getById(id: string): Observable<Customer> {
    return this.httpClient.get<Response>("api/customer/" + id).pipe(
      map(object => this.mapDates(<Customer>object.data))
    );
  }

  public insert(customer: Customer): Observable<Customer> {
    return this.httpClient.post<Response>("api/customer", customer).pipe(
      tap(() => this.reloadData()),
      map(object => this.mapDates(<Customer>object.data))
    );
  }

  public update(customer: Customer): Observable<Customer> {
    return this.httpClient.put<Response>("api/customer/" + customer.id, customer).pipe(
      tap(() => this.reloadData()),
      map(object => this.mapDates(<Customer>object.data))
    );
  }

  /**
   * lastOrderDate from server is a string --> Map it to Date
   * @param customer 
   * @returns 
   */
  private mapDates(customer: Customer): Customer {
    if (customer.lastOrderDate) {
      customer.lastOrderDate = new Date(customer.lastOrderDate);
    }
    return customer;
  }
}
