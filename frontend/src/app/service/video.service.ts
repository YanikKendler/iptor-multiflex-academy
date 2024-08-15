import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import {Tag} from "./tag.service";
import {Question} from "./question.service";
import {Comment} from "./comment.service";
import {User} from "./user.service";

export enum VisibilityEnum {
  self="self",everyone="everyone", customers="customers", internal="internal"
}

export interface StarRating {
  ratingId: number;
  rating: number;
}

export interface ViewProgress {
  progressId: number;
  durationSeconds: number;
  user: User;
}

export interface VideoFile {
  videoFileId: number;
  durationSeconds: number;
  sizeBytes: number;
  originalFileExtension: string;
  originalFileName: string;
  timestamp: string;
}

export interface VideoDetail {
  videoId: number;
  title: string;
  description: string;
  tags: Tag[];
  color: string;
  comments: Comment[];
  questions: Question[];
  starRatings: StarRating[];
  visibility: VisibilityEnum;
  videoFile: VideoFile;
}

export interface VideoDetailDTO {
  videoId: number;
  title: string;
  description: string;
  tags: Tag[];
  comments: Comment[];
  questions: Question[];
  rating: number;
  videoFile: VideoFile;
  viewProgress: number;
}

export interface VideoOverviewDTO {
  videoId: number;
  title: string;
  description: string;
  tags: Tag[];
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

  getVideoList(): Observable<VideoOverviewDTO[]>{
    return this.http.get<VideoOverviewDTO[]>("http://localhost:8080/api/video/")
  }

  getVideoDetails(videoId: number, userId: number): Observable<VideoDetailDTO>{
    return this.http.get<VideoDetailDTO>(`http://localhost:8080/api/video/${videoId}?userId=${userId}`)
  }

  getVideoProgress(videoId: number, userId: number): Observable<ViewProgress>{
    return this.http.get<ViewProgress>(`http://localhost:8080/api/video/${videoId}/progress/${userId}`)
  }

  setVideoProgress(videoId: number, userId: number, progress: number) {
    return this.http.put(`http://localhost:8080/api/video/${videoId}/progress/${userId}`, {
      durationSeconds: progress
    })
  }

  setStarRating(videoId: number, userId: number, rating: number) {
    return this.http.put(`http://localhost:8080/api/video/${videoId}/starrating?userId=${userId}`, rating)
  }

  getStarRating(videoId: number, userId: number): Observable<number>{
    return this.http.get<number>(`http://localhost:8080/api/video/${videoId}/starrating/user/${userId}`)
  }

  getRatingAvgByVideo(videoId: number){
    return this.http.get<number>(`http://localhost:8080/api/video/${videoId}/starrating/average`)
  }

  createVideo(title: string, description: string, tags: Tag[], color: string, visibility: VisibilityEnum, comments: Comment[], questions: Question[], starRatings: StarRating[]){
    this.http.post<VideoDetail>("http://localhost:8080/api/video/", {
      title: title,
      description: description,
      tags: tags,
      color: color,
      visibility: visibility,
      comments: comments,
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
}
