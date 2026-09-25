import { Routes } from '@angular/router';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';

export const routes: Routes = [
  { path: 'customer', component: CustomerListComponent },
  { path: 'customer/:id', component: CustomerDetailsComponent },
  { path: '**', redirectTo: '/customer' }
];
