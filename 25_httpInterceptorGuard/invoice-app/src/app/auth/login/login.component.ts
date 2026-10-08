import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html'
})
export class LoginComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public login(): void {
    this.authService.login();
    this.router.navigate(['/customer']);
  }
}
