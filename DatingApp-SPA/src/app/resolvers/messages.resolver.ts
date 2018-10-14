import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {

  private readonly DEFAULT_PAGE_NUMBER = 1;
  private readonly DEFAULT_PAGE_SIZE = 5;
  private readonly DEFAULT_MESSAGE_CONTAINER = 'Unread';

  constructor(private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    const userId = this.authService.decodedToken.nameid;

    return this.userService.getMessages(userId, this.DEFAULT_PAGE_NUMBER,
      this.DEFAULT_PAGE_SIZE, this.DEFAULT_MESSAGE_CONTAINER)
      .pipe(
        catchError(error => {
          this.alertifyService.error('Problem retrieving messages');
          this.router.navigate(['/']);
          return of(null);
        })
      );
  }

}
