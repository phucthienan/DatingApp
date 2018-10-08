import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertifyService } from '../../services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private authService: AuthService,
    private alertifyService: AlertifyService) {
  }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  getUsername() {
    return this.authService.decodedToken
      ? this.authService.decodedToken['unique_name']
      : null;
  }

  login() {
    this.authService.login(this.model)
      .subscribe(
        () => this.alertifyService.success('Logged in successfully!'),
        error => this.alertifyService.error(error)
      );
  }

  logout() {
    this.authService.logout();
    this.alertifyService.message('Logged out successfully!');
  }

}
