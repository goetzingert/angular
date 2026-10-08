import { Routes } from '@angular/router';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'customer', component: CustomerListComponent, canActivate: [authGuard] },
  { path: 'customer/:id', component: CustomerDetailsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/customer' }
];
