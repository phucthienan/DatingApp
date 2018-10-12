import { Component, Input, OnInit } from '@angular/core';

import { User } from '../../../models/user.interface';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  public readonly DEFAULT_PHOTO_URL = '../../../assets/user.png';

  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
