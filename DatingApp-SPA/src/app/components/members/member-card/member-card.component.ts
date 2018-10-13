import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { User } from '../../../models/user.interface';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  public readonly DEFAULT_PHOTO_URL = '../../../assets/user.png';

  @Input() user: User;

  constructor(private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService) { }

  ngOnInit() {
  }

  sendLike(id: number) {
    const userId = this.authService.decodedToken.nameid;

    this.userService.sendLike(userId, id)
      .subscribe(
        () => this.alertifyService.success('You have liked ' + this.user.knowAs),
        error => this.alertifyService.error(error)
      );
  }

}
