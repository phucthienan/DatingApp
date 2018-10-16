import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly ADMIN_URL = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  getUsersWithRoles() {
    return this.http.get(`${this.ADMIN_URL}/users-with-roles`);
  }

  updateUserRoles(user: User, roles: any) {
    return this.http.post(`${this.ADMIN_URL}/edit-roles/${user.userName}`, roles);
  }

  getPhotosForApproval() {
    return this.http.get(`${this.ADMIN_URL}/photos-for-moderation`);
  }

  approvePhoto(photoId: number) {
    return this.http.post(`${this.ADMIN_URL}/approve-photo/${photoId}`, null);
  }

  rejectPhoto(photoId: number) {
    return this.http.post(`${this.ADMIN_URL}/reject-photo/${photoId}`, null);
  }

}
