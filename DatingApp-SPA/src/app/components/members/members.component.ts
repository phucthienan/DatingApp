import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResult } from 'src/app/models/paginated-result';
import { Pagination } from 'src/app/models/pagination.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

import { User } from '../../models/user.interface';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  users: User[];

  genders = [
    { value: 'male', display: 'Male' },
    { value: 'female', display: 'Female' }
  ];

  userParams: any = {};
  pagination: Pagination;

  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });

    this.setDefaultFilterValues();
  }

  pageChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers(this.pagination.currentPage,
      this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      });
  }

  setDefaultFilterValues() {
    this.userParams.gender = this.authService.currentUser.gender === 'male'
      ? 'female' : 'male';

    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }

  resetFilter() {
    this.setDefaultFilterValues();
    this.getUsers();
  }

}
