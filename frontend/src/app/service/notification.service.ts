import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User, UserService} from "./user.service";
import {ContentOverviewDTO, VideoOverviewDTO} from "./video.service";
import {Comment} from "./comment.service";
import {Config} from "../config";

export interface Notification {
  notificationId: number;
  forUser: User;
  triggeredByUser: User;
  done: boolean;
}

export interface ContentNotification extends Notification {
  content: ContentOverviewDTO;
  type: ContentNotificationEnum;
}

export interface CommentNotification extends Notification {
  content: VideoOverviewDTO;
  comment: Comment;
}

export interface VideoRequestNotification extends Notification{
  requestMessage: string;
}

export interface TextNotification extends Notification{
  headerText: string;
  text: string;
}

export enum ContentNotificationEnum {
  update="update", assignment="assignment", finishedRequest="finishedRequest", approved="approved"
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  http = inject(HttpClient)
  userService = inject(UserService)

  getNotifications() {
    return this.http.get<Notification[]>(`${Config.API_URL}/notification?userId=${this.userService.currentUser.value.userId}`)
  }

  update(notification: Notification) {
    return this.http.put(`${Config.API_URL}/notification/done/${notification.notificationId}/${notification.done}`, {}).subscribe()
  }
}
