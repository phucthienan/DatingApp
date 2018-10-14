import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.interface';
import { Pagination } from 'src/app/models/pagination.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { PaginatedResult } from 'src/app/models/paginated-result';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messageContainer = 'Unread';
  messages: Message[];
  pagination: Pagination;

  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  pageChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.getMessages();
  }

  getMessages() {
    const userId = this.authService.decodedToken.nameid;

    this.userService.getMessages(userId, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer)
      .subscribe((res: PaginatedResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      }, error => this.alertifyService.error(error));
  }

  deleteMessage(id: number) {
    this.alertifyService.confirm('Are you sure you want to delete this message?', () => {
      const userId = this.authService.decodedToken.nameid;

      this.userService.deleteMessage(userId, id)
        .subscribe(
          () => {
            this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
            this.alertifyService.success('Delete message successfully');
          },
          error => this.alertifyService.error(error)
        );
    });
  }

}
