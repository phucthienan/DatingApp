import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertifyService } from '../../services/alertify.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public readonly DEFAULT_PHOTO_URL = '../../assets/user.png';

  model: any = {};
  photoUrl: string;

  constructor(private authService: AuthService,
    private alertifyService: AlertifyService,
    private router: Router) {
  }

  ngOnInit() {
    this.authService.currentPhotoUrl
      .subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  get user() {
    return this.authService.currentUser;
  }

  login() {
    this.authService.login(this.model)
      .subscribe(
        () => this.alertifyService.success('Logged in successfully'),
        error => this.alertifyService.error(error),
        () => this.router.navigate(['/members'])
      );
  }

  logout() {
    this.authService.logout();
    this.alertifyService.message('Logged out successfully');
    this.router.navigate(['/']);
  }

}
