import { Component } from '@angular/core';
import { Customer } from './customer/customer.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invoice-app';
  customers : Customer[];
  constructor(){
    this.customers = [new Customer("Silke", "Mueller"), new Customer("Hans", "Meyer", "Hauptstraße 21", "11111", "Teststadt")];
  }
}
