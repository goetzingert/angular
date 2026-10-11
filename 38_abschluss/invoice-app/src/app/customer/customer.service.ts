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

// Demo für Übung 36: Das Backend liefert kein Feld "note". Damit man die Anzeige-Varianten
// ausprobieren kann, wird für Kunde 1 clientseitig eine Notiz mit Schadcode-Beispiel ergänzt.
// ACHTUNG: Das ist ein Lehrbeispiel. Echte Notizen dürfen NIE ungeprüft als HTML ausgegeben werden.
export const DEMO_NOTE = `<b>wichtig</b> <img src=x onerror="alert('XSS')">`;

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly httpClient = inject(HttpClient);

  // Reine API-Schicht: kein versteckter Zustand mehr (kein ReplaySubject, kein Laden im Konstruktor).
  // Den Zustand (Liste, Filter, Auswahl) hält der CustomerStore.
  public getAll(): Observable<Customer[]> {
    return this.httpClient.get<ResponseArray>("api/customer").pipe(
      map(object => object.data.map(customer => this.prepare(customer)))
    );
  }

  public getById(id: string): Observable<Customer> {
    return this.httpClient.get<Response>("api/customer/" + encodeURIComponent(id)).pipe(
      map(object => this.prepare(<Customer>object.data))
    );
  }

  public insert(customer: Customer): Observable<Customer> {
    return this.httpClient.post<Response>("api/customer", customer).pipe(
      map(object => this.prepare(<Customer>object.data))
    );
  }

  public update(customer: Customer): Observable<Customer> {
    return this.httpClient.put<Response>("api/customer/" + encodeURIComponent(customer.id), customer).pipe(
      map(object => this.prepare(<Customer>object.data))
    );
  }

  /**
   * lastOrderDate from server is a string --> Map it to Date.
   * Außerdem wird für Kunde 1 die Demo-Notiz ergänzt (nur für Übung 36).
   */
  private prepare(customer: Customer): Customer {
    if (customer.lastOrderDate) {
      customer.lastOrderDate = new Date(customer.lastOrderDate);
    }
    if (String(customer.id) === '1' && !customer.note) {
      customer.note = DEMO_NOTE;
    }
    return customer;
  }
}
