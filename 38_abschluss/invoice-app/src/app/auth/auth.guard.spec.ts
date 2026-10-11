import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, provideRouter } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = { url: '/customer/1' } as RouterStateSnapshot;

  const runGuard = () => TestBed.runInInjectionContext(() => authGuard(route, state));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('should let a logged-in user pass', () => {
    TestBed.inject(AuthService).login();

    expect(runGuard()).toBe(true);
  });

  it('should redirect to the login and remember the requested url', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    expect(runGuard()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/customer/1' } });
  });
});
