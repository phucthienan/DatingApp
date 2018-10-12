import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { User } from '../models/user.interface';

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

  updateUser(id: number, user: User) {
    return this.http.put(`${this.USER_URL}/${id}`, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(
      `${this.USER_URL}/${userId}/photos/${id}/set-main`,
      null
    );
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(`${this.USER_URL}/${userId}/photos/${id}`);
  }

}
