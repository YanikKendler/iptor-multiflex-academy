import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {User} from "./video.service"

export interface CommentModel {
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

  getCommentList(videoId: number): Observable<CommentModel[]>{
    return this.http.get<CommentModel[]>("http://localhost:8080/api/video/" + videoId + "/comment").pipe(
      map(commentList => {
        return commentList
      })
    )
  }

  createComment(videoId: number, text: string, user: number){
    this.http.post("http://localhost:8080/api/video/" + videoId + "/comment", {
      text: text,
      userId: user
    }).subscribe(response =>{
      console.log('Response from server:', response);
      // Weitere Verarbeitung der Response hier
    }, error => {
      console.error('Error occurred:', error);
      // Fehlerbehandlung hier
    });
  }

  deleteComment(videoId: number, commentId: number){
    this.http.delete("http://localhost:8080/api/video/" + videoId + "/comment/" + commentId).subscribe(response => {
      console.log('Response from server:', response);
      // Weitere Verarbeitung der Response hier
    }, error => {
      console.error('Error occurred:', error);
      // Fehlerbehandlung hier
    });
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
