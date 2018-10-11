import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { User } from '../components/models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USER_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.USER_URL}`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.USER_URL}/${id}`);
  }

}
