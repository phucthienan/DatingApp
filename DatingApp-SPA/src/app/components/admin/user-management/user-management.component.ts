import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { User } from 'src/app/models/user.interface';
import { AdminService } from 'src/app/services/admin.service';
import { AlertifyService } from 'src/app/services/alertify.service';

import { RolesModalComponent } from '../roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  users: User[];
  bsModalRef: BsModalRef;

  constructor(private adminService: AdminService,
    private alertifyService: AlertifyService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles()
      .subscribe(
        (users: User[]) => this.users = users,
        error => this.alertifyService.error(error)
      );
  }

  openEditRolesModal(user: User) {
    const initialState = {
      user,
      roles: this.getRoles(user)
    };

    this.bsModalRef = this.modalService.show(RolesModalComponent, { initialState });
    this.bsModalRef.content.updateSelectedRoles
      .subscribe(value => {
        const rolesToUpdate = {
          roleNames: [...value.filter(v => v.checked).map(v => v.name)]
        };

        if (rolesToUpdate) {
          this.adminService.updateUserRoles(user, rolesToUpdate)
            .subscribe(
              () => user.roles = [...rolesToUpdate.roleNames],
              error => this.alertifyService.error(error));
        }
      });
  }

  private getRoles(user: User) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Moderator', value: 'Moderator' },
      { name: 'VIP', value: 'VIP' },
      { name: 'Member', value: 'Member' }
    ];

    availableRoles.forEach(availableRole => {
      let isMatch = false;

      userRoles.forEach(userRole => {
        if (availableRole.name === userRole) {
          isMatch = true;
          availableRole.checked = true;
          roles.push(availableRole);
          return;
        }
      });

      if (!isMatch) {
        availableRole.checked = false;
        roles.push(availableRole);
      }
    });

    return roles;
  }

}
