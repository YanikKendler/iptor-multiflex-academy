import {Component, inject, Input, OnInit} from '@angular/core';
import {
  CommentNotification,
  ContentNotification,
  Notification, NotificationService, TextNotification,
  VideoRequestNotification
} from "../../../service/notification.service";
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {faBox, faCheck} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    IconButtonComponent,
    FaIconComponent
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit{
  @Input() notification: Notification = {} as Notification;

  notificationService = inject(NotificationService)

  contentNotification : ContentNotification = {} as ContentNotification
  commentNotification : CommentNotification = {} as CommentNotification
  videoRequestNotification : VideoRequestNotification = {} as VideoRequestNotification
  textNotification : TextNotification = {} as TextNotification

  ngOnInit(): void {
    console.log(this.notification)
    console.log(this.getType())
  }

  getType(){
    if(this.notification.hasOwnProperty("content")){
      this.contentNotification = this.notification as ContentNotification
      return this.contentNotification.type
    } else if(this.notification.hasOwnProperty("video")){
      this.commentNotification = this.notification as CommentNotification
      return "comment"
    } else if(this.notification.hasOwnProperty("requestMessage")){
      this.videoRequestNotification = this.notification as VideoRequestNotification
      return "request"
    } else if(this.notification.hasOwnProperty("text")){
      this.textNotification = this.notification as TextNotification
      return "text"
    }
    return ""
  }

  protected readonly faCheck = faCheck;

  toggleDoneNotification() {
    this.notification.done = !this.notification.done
    this.notificationService.update(this.notification)
  }

  protected readonly faBox = faBox;
}
