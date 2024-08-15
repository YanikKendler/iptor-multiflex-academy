import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {User} from "./user.service"
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

  getCommentList(videoId: number): Observable<Comment[]>{
    return this.http.get<Comment[]>(`http://localhost:8080/api/video/${videoId}/comment?userId=${Config.USER_ID}`)
  }

  createComment(videoId: number, text: string){
    return this.http.post(`http://localhost:8080/api/video/${videoId}/comment`, {
      text: text,
      userId: Config.USER_ID
    });
  }

  deleteComment(videoId: number, commentId: number){
    return this.http.delete(`http://localhost:8080/api/video/${videoId}/comment/${commentId}?userId=${Config.USER_ID}`);
  }

  updateComment(videoId: number, commentId: number, text: string){
    this.http.put("http://localhost:8080/api/video/" + videoId + "/comment/" + commentId, {
      text: text
    }).subscribe(response =>{
      console.log('Response from server:', response);
      // Weitere Verarbeitung der Response hier
    }, error => {
      console.error('Error occurred:', error);
      // Fehlerbehandlung hier
    });
  }


  constructor() { }
}
