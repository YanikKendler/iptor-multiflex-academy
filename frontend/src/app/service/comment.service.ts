import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {User} from "./user.service"

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

  getCommentList(videoId: number, userId: number): Observable<Comment[]>{
    return this.http.get<Comment[]>(`http://localhost:8080/api/video/${videoId}/comment?userId=${userId}`)
  }

  createComment(videoId: number, text: string, user: number){
    return this.http.post(`http://localhost:8080/api/video/${videoId}/comment`, {
      text: text,
      userId: user
    });
  }

  deleteComment(videoId: number, userId: number, commentId: number){
    return this.http.delete(`http://localhost:8080/api/video/${videoId}/comment/${commentId}?userId=${userId}`);
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
