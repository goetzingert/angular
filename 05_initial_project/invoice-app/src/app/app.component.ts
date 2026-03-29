import { Component } from '@angular/core';
import { Customer } from './customer/customer.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invoice-app';
  customers : Customer[]= [new Customer("Hans", "Meyer", "Hauptstraße 21", "11111", "Teststadt")];
  constructor(){

  }
}
