import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly AUTH_URL = `${environment.apiUrl}/auth`;
  private readonly DEFAULT_PHOTO_URL = '../../assets/user.png';

  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;

  photoUrlSubject = new BehaviorSubject<string>(this.DEFAULT_PHOTO_URL);
  currentPhotoUrl = this.photoUrlSubject.asObservable();

  constructor(private http: HttpClient) { }

  readTokenFromStorage() {
    const token = localStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(token);
  }

  readCurrentUserFromStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
      this.changeMainPhotoUrl(this.currentUser.photoUrl);
    }
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  isRoleMatch(allowedRoles: string[]): boolean {
    let result = false;
    const userRoles = this.decodedToken.role as Array<string>;
    allowedRoles.forEach(allowedRole => {
      if (userRoles.includes(allowedRole)) {
        result = true;
        return;
      }
    });

    return result;
  }

  register(user: User) {
    return this.http.post(`${this.AUTH_URL}/register`, user);
  }

  login(model: any) {
    return this.http.post(`${this.AUTH_URL}/login`, model)
      .pipe(
        map(({ token, user }: any) => {
          if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            this.decodedToken = this.jwtHelper.decodeToken(token);
            this.currentUser = user;
            this.changeMainPhotoUrl(this.currentUser.photoUrl);
          }
        })
      );
  }

  logout() {
    this.decodedToken = null;
    this.currentUser = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  changeMainPhotoUrl(photoUrl: string) {
    this.photoUrlSubject.next(photoUrl);
    this.currentUser.photoUrl = photoUrl;
    localStorage.setItem('user', JSON.stringify(this.currentUser));
  }

}
