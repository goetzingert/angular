import { Routes } from '@angular/router';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'customer', component: CustomerListComponent, canActivate: [authGuard] },
  {
    path: 'customer/:id',
    // Lazy Route: Die Detail-Seite (inkl. Formular und Bild-Direktive) landet in einem eigenen Chunk
    loadComponent: () => import('./customer/customer-details/customer-details.component')
      .then(m => m.CustomerDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    // Lazy Route: Das Dashboard wird erst beim Aufruf nachgeladen
    loadComponent: () => import('./customer/dashboard/customer-dashboard.component')
      .then(m => m.CustomerDashboardComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/customer' }
];
