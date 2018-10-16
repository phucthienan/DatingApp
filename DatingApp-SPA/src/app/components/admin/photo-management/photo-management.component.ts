import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Photo } from 'src/app/models/photo.interface';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {

  photos: Photo[];

  constructor(private adminService: AdminService,
    private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.getPhotosForApproval();
  }

  getPhotosForApproval() {
    this.adminService.getPhotosForApproval()
      .subscribe(
        (photos: Photo[]) => this.photos = photos,
        error => this.alertifyService.error(error)
      );
  }

  approvePhoto(photoId: number) {
    this.adminService.approvePhoto(photoId)
      .subscribe(
        () => this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1),
        error => this.alertifyService.error(error)
      );
  }

  rejectPhoto(photoId: number) {
    this.adminService.rejectPhoto(photoId)
      .subscribe(
        () => this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1),
        error => this.alertifyService.error(error)
      );
  }

}
