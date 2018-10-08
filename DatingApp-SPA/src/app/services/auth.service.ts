import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly BASE_AUTH_URL = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) { }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  register(model: any) {
    return this.http.post(`${this.BASE_AUTH_URL}/login`, model);
  }

  login(model: any) {
    return this.http.post(`${this.BASE_AUTH_URL}/login`, model)
    .pipe(
      map((response: any) => {
        if (response) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

}
