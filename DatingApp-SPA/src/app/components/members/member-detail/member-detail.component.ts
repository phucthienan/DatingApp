import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';

import { User } from '../../../models/user.interface';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  public readonly DEFAULT_PHOTO_URL = '../../../assets/user.png';

  @ViewChild('memberTabs') memberTabs: TabsetComponent;

  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    this.route.queryParamMap.subscribe(params => {
      const tabId = parseInt(params.get('tab'), 10);
      this.selectTab(tabId);
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      }
    ];

    this.galleryImages = this.getImages();
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId > 0 ? tabId : 0].active = true;
  }

  getImages() {
    return this.user.photos.map(photo => ({
      small: photo.url,
      medium: photo.url,
      big: photo.url,
      description: photo.description
    }));
  }

}
