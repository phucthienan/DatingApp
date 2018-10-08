import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly BASE_AUTH_URL = 'http://localhost:5000/api/auth';

  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) { }

  readTokenFromStorage() {
    const token = localStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(token);
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  register(model: any) {
    return this.http.post(`${this.BASE_AUTH_URL}/register`, model);
  }

  login(model: any) {
    return this.http.post(`${this.BASE_AUTH_URL}/login`, model)
      .pipe(
        map(({ token }: any) => {
          if (token) {
            localStorage.setItem('token', token);
            this.decodedToken = this.jwtHelper.decodeToken(token);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
  }

}
