import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import {TagModel} from "./tag.service";
import {QuestionModel} from "./question.service";

export enum VisibilityEnum {
  self="self",everyone="everyone", customers="customers", internal="internal"
}

export interface CommentModel {
  commentId: number;
  title: string;
  text: string;
}

export interface StarRatingModel {
  ratingId: number;
  rating: number;
}

export interface UserModel {
  userId: number;
  username: string;
  email: string;
}

export interface ViewProgressModel{
  progressId: number;
  durationSeconds: number;
  user: UserModel;
}

export interface VideoModel {
  videoId: number;
  title: string;
  description: string;
  tags: TagModel[];
  saved: boolean;
  color: string;
  durationSeconds: number;
  comments: CommentModel[];
  questions: QuestionModel[];
  starRatings: StarRatingModel[];
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

  getVideoById(id: number): Observable<VideoModel>{
    return this.http.get<VideoModel>("http://localhost:8080/api/video/" + id).pipe(
      map(videoList => {
        return videoList
      })
    )
  }

  getVideoProgress(videoId: number, userId: number): Observable<ViewProgressModel>{
    return this.http.get<ViewProgressModel>("http://localhost:8080/api/video/" + videoId + "/progress/" + userId + "/latest").pipe(
      map(videoList => {
        return videoList
      })
    )
  }
}
