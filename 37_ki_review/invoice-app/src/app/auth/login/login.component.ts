import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { safeReturnUrl } from '../return-url';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html'
})
export class LoginComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Kommt aus ?returnUrl=... (withComponentInputBinding bindet Query-Parameter an Inputs)
  returnUrl = input<string>();

  public login(): void {
    this.authService.login();
    // Nie ungeprüft navigieren: sonst wäre das eine offene Weiterleitung.
    this.router.navigateByUrl(safeReturnUrl(this.returnUrl()) ?? '/customer');
  }
}
