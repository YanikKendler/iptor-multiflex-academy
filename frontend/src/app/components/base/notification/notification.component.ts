import {Component, EventEmitter, HostBinding, HostListener, inject, Input, OnInit, Output} from '@angular/core';
import {
  CommentNotification,
  ContentNotification,
  Notification, NotificationService, TextNotification,
  VideoRequestNotification
} from "../../../service/notification.service";
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {faBox, faCheck, faRepeat} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCalendar, faCalendarCheck, faCircleCheck, faSquare, faSquareCheck} from "@fortawesome/free-regular-svg-icons";
import {faCircleCheck as faCircleCheck2} from "@fortawesome/free-solid-svg-icons";
import {Router} from "@angular/router";

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
  @Input() mode : 'all' | 'unread' = 'all'

  @HostBinding('class.current') get isDone(): boolean {
    return this.notification?.done == false;
  }

  notificationService = inject(NotificationService)

  contentNotification : ContentNotification = {} as ContentNotification
  commentNotification : CommentNotification = {} as CommentNotification
  videoRequestNotification : VideoRequestNotification = {} as VideoRequestNotification
  textNotification : TextNotification = {} as TextNotification

  ngOnInit(): void {
    console.log(this.notification)
  }

  getType(){
    if(this.notification.hasOwnProperty("comment")) {
      this.commentNotification = this.notification as CommentNotification
      console.log(this.commentNotification)
      return "comment"
    } else if(this.notification.hasOwnProperty("content")){
      this.contentNotification = this.notification as ContentNotification
      return this.contentNotification.type
    } else if(this.notification.hasOwnProperty("requestMessage")){
      this.videoRequestNotification = this.notification as VideoRequestNotification
      return "request"
    } else if(this.notification.hasOwnProperty("text")){
      this.textNotification = this.notification as TextNotification
      return "text"
    }
    return ""
  }

  constructor(private router: Router) {
  }

  @HostListener('click', ['$event'])
  linkToNotification(event: MouseEvent) {
    console.log((event.composedPath().at(0) as HTMLElement).tagName)
    if((event.composedPath().at(0) as HTMLElement).tagName === "BUTTON" ||
      (event.composedPath().at(0) as HTMLElement).tagName === "svg" ||
      (event.composedPath().at(0) as HTMLElement).tagName === "path"){
      return
    }

    if(this.getType() !== "request" && this.getType() !== "text" && this.getType() !== ""){
      if(this.getType() === "comment"){
        this.router.navigate(['video/' + this.commentNotification.content.contentId])
      } else{
        this.router.navigate(['video/' + this.contentNotification.content.contentId])
      }
    } else if(this.getType() === "request"){
      this.router.navigate(['account/video-requests'])
    }
  }


  toggleDoneNotification() {
    this.notification.done = !this.notification.done
    this.notificationService.update(this.notification)
  }

  protected readonly faCheck = faCheck;
  protected readonly faCircleCheck = faCircleCheck;
  protected readonly faCircleCheck2 = faCircleCheck2;
  protected readonly faCalendar = faCalendar
  protected readonly faCalendarCheck = faCalendarCheck
  protected readonly faSquare = faSquare
  protected readonly faSquareCheck = faSquareCheck
  protected readonly faRepeat = faRepeat
}
