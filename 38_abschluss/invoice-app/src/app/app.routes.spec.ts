import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { AuthService } from './auth/auth.service';
import { CustomerDashboardComponent } from './customer/dashboard/customer-dashboard.component';
import { LOAD_TEST_SIZE } from './customer/customer.store';
import { routes } from './app.routes';

describe('routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes), provideHttpClient(), provideHttpClientTesting(),
        { provide: LOAD_TEST_SIZE, useValue: 0 }
      ]
    });
  });

  it('should load the dashboard lazily', () => {
    const route = routes.find(r => r.path === 'dashboard');

    expect(route?.loadComponent).toBeTypeOf('function');
    expect(route?.component).toBeUndefined();
  });

  it('should open the dashboard for a logged-in user', async () => {
    TestBed.inject(AuthService).login();
    const harness = await RouterTestingHarness.create();

    const dashboard = await harness.navigateByUrl('/dashboard', CustomerDashboardComponent);
    TestBed.inject(HttpTestingController).expectOne('api/customer').flush({ data: [] });

    expect(dashboard).toBeInstanceOf(CustomerDashboardComponent);
  });

  it('should send an anonymous user to the login with a returnUrl', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/dashboard');

    expect(TestBed.inject(AuthService).isLoggedIn()).toBe(false);
    expect(harness.routeNativeElement?.textContent).toContain('Login erforderlich');
    expect(TestBed.inject(Router).url).toBe('/login?returnUrl=%2Fdashboard');
  });
});
