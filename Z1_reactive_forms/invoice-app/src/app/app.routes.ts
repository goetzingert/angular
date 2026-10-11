import { Routes } from '@angular/router';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';

export const routes: Routes = [
  { path: 'customer/:id', component: CustomerDetailsComponent },
  { path: 'customer', component: CustomerListComponent },
  { path: '**', redirectTo: '/customer' }
];
