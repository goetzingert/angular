import { Component } from '@angular/core';
import { Customer } from './customer/customer.model';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomerListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invoice-app';

  public customersList: Customer[];
  constructor() {
    this.customersList = [new Customer("Silke", "Mueller"), new Customer("Hans", "Meyer", "Hauptstraße 21", "11111", "Teststadt")];
  }
}
