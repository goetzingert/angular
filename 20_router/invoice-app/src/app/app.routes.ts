import { Routes } from '@angular/router';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';

export const routes: Routes = [
  { path: 'customer', component: CustomerListComponent },
  { path: '**', redirectTo: '/customer' }
];
