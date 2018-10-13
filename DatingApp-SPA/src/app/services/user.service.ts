import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { PaginatedResult } from '../models/PaginatedResult';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USER_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getUsers(pageNumber?, pageSize?, userParams?, likesParam?): Observable<PaginatedResult<User[]>> {
    const paginatedResult = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    if (userParams) {
      params = params.append('gender', userParams.gender);
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likesParam === 'Likees') {
      params = params.append('likees', 'true');
    }

    return this.http.get(`${this.USER_URL}`, { observe: 'response', params })
      .pipe(
        map((response: any) => {
          paginatedResult.result = response.body;

          if (response.headers.get('Pagination')) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }

          return paginatedResult;
        })
      );
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

  sendLike(userId: number, recipientId: number) {
    return this.http.post(`${this.USER_URL}/${userId}/like/${recipientId}`, null);
  }

}
