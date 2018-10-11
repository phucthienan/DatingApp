import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from '../components/models/user.interface';
import { AlertifyService } from '../services/alertify.service';
import { UserService } from '../services/user.service';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {

  constructor(private router: Router,
    private userService: UserService,
    private alertifyService: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    const userId = route.params['id'];
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
