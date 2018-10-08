import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private alertifyService: AlertifyService,
    private router: Router) {
  }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.alertifyService.error('You must be logged in!');
    this.router.navigate(['/']);
  }

}
