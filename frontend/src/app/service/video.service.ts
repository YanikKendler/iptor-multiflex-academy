import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import {TagModel} from "./tag.service";
import {QuestionModel} from "./question.service";
import {CommentModel} from "./comment.service";

export enum VisibilityEnum {
  self="self",everyone="everyone", customers="customers", internal="internal"
}

export interface StarRating {
  ratingId: number;
  rating: number;
}

export interface User {
  userId: number;
  username: string;
  email: string;
}

export interface ViewProgress {
  progressId: number;
  durationSeconds: number;
  user: User;
}

export interface Video {
  videoId: number;
  title: string;
  description: string;
  tags: TagModel[];
  color: string;
  durationSeconds: number;
  comments: CommentModel[];
  questions: QuestionModel[];
  starRatings: StarRating[];
  visibility: VisibilityEnum;
}

export interface VideoOverview {
  videoId: number;
  title: string;
  description: string;
  tags: TagModel[];
  saved: boolean;
  color: string;
  durationSeconds: number;
  viewProgress?: ViewProgress;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  http = inject(HttpClient)

  getVideoList(): Observable<VideoOverview[]>{
    return this.http.get<VideoOverview[]>("http://localhost:8080/api/video/").pipe(
      map(videoList => {
        return videoList
      })
    )
  }

  createVideo(title: string, description: string, tags: TagModel[], color: string, durationSeconds: number, visibility: VisibilityEnum, coments: CommentModel[], questions: QuestionModel[], starRatings: StarRating[]){
    this.http.post("http://localhost:8080/api/video/", {
      title: title,
      description: description,
      tags: tags,
      color: color,
      durationSeconds: durationSeconds,
      visibility: visibility,
      comments: coments,
      questions: questions,
      starRatings: starRatings
    }).subscribe(response =>{
      console.log('Response from server:', response);
      // Weitere Verarbeitung der Response hier
    }, error => {
      console.error('Error occurred:', error);
      // Fehlerbehandlung hier
    });
  }


  getVideoById(id: number): Observable<Video>{
    return this.http.get<Video>("http://localhost:8080/api/video/" + id).pipe(
      map(videoList => {
        return videoList
      })
    )
  }

  getVideoProgress(videoId: number, userId: number): Observable<ViewProgress>{
    return this.http.get<ViewProgress>("http://localhost:8080/api/video/" + videoId + "/progress/" + userId).pipe(
      map(videoList => {
        return videoList
      })
    )
  }
}
