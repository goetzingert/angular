import { Component } from '@angular/core';
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
}
