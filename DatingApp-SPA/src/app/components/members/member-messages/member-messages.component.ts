import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Message } from 'src/app/models/message.interface';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @Input() recipientId: number;

  messages: Message[];
  newMessage: any = {};

  constructor(private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.getMessages();
  }

  getMessages() {
    const userId = +this.authService.decodedToken.nameid;

    this.userService.getMessageThread(userId, this.recipientId)
      .pipe(
        tap((messages: Message[]) => {
          messages.forEach((message: Message) => {
            if (message.recipientId === userId && !message.isRead) {
              this.userService.markAsRead(userId, message.id).subscribe();
              message.isRead = true;
            }
          });
        })
      )
      .subscribe(
        (messages: Message[]) => this.messages = messages,
        error => this.alertifyService.error(error)
      );
  }

  sendMessage() {
    const userId = this.authService.decodedToken.nameid;
    this.newMessage.recipientId = this.recipientId;

    this.userService.sendMessage(userId, this.newMessage)
      .subscribe(
        (message: Message) => {
          this.messages.unshift(message);
          this.newMessage = {};
        }, error => this.alertifyService.error(error)
      );
  }

}
