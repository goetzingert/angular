import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { MockInstance } from 'vitest';
import { Router, provideRouter } from '@angular/router';

import { AuthService } from '../auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let navigateByUrl: MockInstance<Router['navigateByUrl']>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    fixture = TestBed.createComponent(LoginComponent);
    await fixture.whenStable();
  });

  const clickLogin = () => (fixture.nativeElement as HTMLElement).querySelector('button')!.click();

  it('should log in and go to the customer list by default', () => {
    clickLogin();

    expect(TestBed.inject(AuthService).isLoggedIn()).toBe(true);
    expect(navigateByUrl).toHaveBeenCalledWith('/customer');
  });

  it('should return to a safe returnUrl', async () => {
    fixture.componentRef.setInput('returnUrl', '/customer/1');
    await fixture.whenStable();

    clickLogin();

    expect(navigateByUrl).toHaveBeenCalledWith('/customer/1');
  });

  it.each(['https://evil.example/customer', '//evil.example', 'javascript:alert(1)', '/login'])(
    'should ignore the unsafe returnUrl %s',
    async unsafe => {
      fixture.componentRef.setInput('returnUrl', unsafe);
      await fixture.whenStable();

      clickLogin();

      expect(navigateByUrl).toHaveBeenCalledWith('/customer');
    }
  );
});
