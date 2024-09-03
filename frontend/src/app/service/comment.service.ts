import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {User, UserService} from "./user.service"
import {Config} from "../config"

export interface Comment {
  commentId: number;
  title: string;
  text: string;
  user: User;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  http = inject(HttpClient)
  userService = inject(UserService)

  getCommentList(videoId: number): Observable<Comment[]>{
    return this.http.get<Comment[]>(`${Config.API_URL}/video/${videoId}/comment?userId=${this.userService.currentUser.value.userId}`)
  }

  createComment(videoId: number, text: string){
    return this.http.post(`${Config.API_URL}/video/${videoId}/comment?userId=${this.userService.currentUser.value.userId}`, {
      text: text,
      userId: this.userService.currentUser.value.userId
    });
  }

  deleteComment(videoId: number, commentId: number){
    return this.http.delete(`${Config.API_URL}/video/${videoId}/comment/${commentId}?userId=${this.userService.currentUser.value.userId}`);
  }

  updateComment(videoId: number, comment: Comment){
    return this.http.put(`${Config.API_URL}/video/${videoId}/comment/${comment.commentId}`, comment);
  }
}
