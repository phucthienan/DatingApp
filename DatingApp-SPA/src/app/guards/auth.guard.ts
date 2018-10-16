import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

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

  canActivate(next: ActivatedRouteSnapshot): boolean {
    const roles = next.firstChild.data['roles'] as Array<string>;

    if (roles) {
      if (this.authService.isRoleMatch(roles)) {
        return true;
      } else {
        this.router.navigate(['/members']);
        this.alertifyService.error('You cannot access this area!');
      }
    }

    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.alertifyService.error('You must be logged in!');
    this.router.navigate(['/']);
    return false;
  }

}
