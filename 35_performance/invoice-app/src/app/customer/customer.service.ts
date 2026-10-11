import { Injectable, inject } from '@angular/core';
import { Customer } from './customer.model';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

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

  private readonly httpClient = inject(HttpClient);

  // Reine API-Schicht: kein versteckter Zustand mehr (kein ReplaySubject, kein Laden im Konstruktor).
  // Den Zustand (Liste, Filter, Auswahl) hält der CustomerStore.
  public getAll(): Observable<Customer[]> {
    return this.httpClient.get<ResponseArray>("api/customer").pipe(
      map(object => object.data.map(customer => this.mapDates(customer)))
    );
  }

  public getById(id: string): Observable<Customer> {
    return this.httpClient.get<Response>("api/customer/" + id).pipe(
      map(object => this.mapDates(<Customer>object.data))
    );
  }

  public insert(customer: Customer): Observable<Customer> {
    return this.httpClient.post<Response>("api/customer", customer).pipe(
      map(object => this.mapDates(<Customer>object.data))
    );
  }

  public update(customer: Customer): Observable<Customer> {
    return this.httpClient.put<Response>("api/customer/" + customer.id, customer).pipe(
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
