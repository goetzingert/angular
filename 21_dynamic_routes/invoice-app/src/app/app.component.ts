import { Component } from '@angular/core';
import { Customer } from './customer/customer.model';
import { CustomerService } from './customer/customer.service';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invoice-app';

}
