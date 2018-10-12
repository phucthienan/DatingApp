import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from '../models/user.interface';
import { AlertifyService } from '../services/alertify.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {

  constructor(private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    const userId = this.authService.decodedToken.nameid;

    return this.userService.getUser(userId)
      .pipe(
        catchError(error => {
          this.alertifyService.error('Problem retrieving data');
          this.router.navigate(['/members']);
          return of(null);
        })
      );
  }

}
