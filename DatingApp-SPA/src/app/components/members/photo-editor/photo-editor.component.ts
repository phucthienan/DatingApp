import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

import { Photo } from '../../models/photo.interface';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  private readonly BASE_URL = `${environment.apiUrl}`;

  @Input() photos: Photo[];
  @Output() mainPhotoChange = new EventEmitter<any>();

  currentMainPhoto: Photo;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  constructor(private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService) {
  }

  ngOnInit() {
    this.initializeUploader();
  }

  initializeUploader() {
    const userId = this.authService.decodedToken.nameid;
    const token = localStorage.getItem('token');

    this.uploader = new FileUploader({
      url: `${this.BASE_URL}/users/${userId}/photos`,
      authToken: `Bearer ${token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = file => file.withCredentials = false;

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };

        this.photos.push(photo);
      }
    };
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo) {
    const userId = this.authService.decodedToken.nameid;
    this.userService.setMainPhoto(userId, photo.id).subscribe(
      () => {
        this.currentMainPhoto = this.photos.filter(p => p.isMain)[0];
        this.currentMainPhoto.isMain = false;
        photo.isMain = true;
        this.authService.changeMainPhotoUrl(photo.url);
        this.alertifyService.success('Set main photo successfully!');
      },
      error => this.alertifyService.error(error)
    );
  }

  deletePhoto(id: number) {
    this.alertifyService.confirm('Are you sure you want to delete this photo?', () => {
      const userId = this.authService.decodedToken.nameid;

      this.userService.deletePhoto(userId, id)
        .subscribe(
          () => {
            this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
            this.alertifyService.success('Delete photo successfully!');
          },
          error => this.alertifyService.error('Delete photo failed!')
        );
    });
  }

}
