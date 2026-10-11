import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Zu Demozwecken: einfacher Signal-basierter Login-Status.
  // In einer echten App würde hier z.B. ein Token geprüft/gespeichert werden.
  private readonly loggedIn = signal(false);

  public isLoggedIn(): boolean {
    return this.loggedIn();
  }

  public login(): void {
    this.loggedIn.set(true);
  }

  public logout(): void {
    this.loggedIn.set(false);
  }
}
