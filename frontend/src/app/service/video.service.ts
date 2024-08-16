import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import {Tag} from "./tag.service";
import {Question} from "./question.service";
import {Comment} from "./comment.service";
import {User} from "./user.service";
import {Config} from "../config"

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
  durationSeconds?: number;
  sizeBytes?: number;
  originalFileExtension?: string;
  originalFileName?: string;
  timestamp?: string;
}

export interface VideoDetailDTO {
  contentId: number
  title: string
  description: string
  tags: Tag[]
  comments: Comment[]
  questions: Question[]
  rating: number
  videoFile?: VideoFile
  viewProgress: number
  visibility: VisibilityEnum
}

export interface VideoOverviewDTO {
  contentId: number;
  title: string;
  description: string;
  tags: Tag[];
  saved: boolean;
  color: string;
  durationSeconds: number;
  viewProgress: ViewProgress;
}

export interface LearningPathOverviewDTO {
  contentId: number;
  title: string;
  description: string;
  tags: Tag[];
  videoCount: number;
  viewProgress: number;
}

export interface VideoAndLearningPathOverviewCollection {
  videos: VideoOverviewDTO[];
  learningPaths: LearningPathOverviewDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  http = inject(HttpClient)

  getVideoList(): Observable<VideoOverviewDTO[]>{
    return this.http.get<VideoOverviewDTO[]>(`${Config.API_URL}/video/`)
  }

  getVideoDetails(videoId: number): Observable<VideoDetailDTO>{
    return this.http.get<VideoDetailDTO>(`${Config.API_URL}/video/${videoId}?userId=${Config.USER_ID}`)
  }

  setStarRating(videoId: number, userId: number, rating: number) {
    return this.http.put(`${Config.API_URL}/video/${videoId}/starrating?userId=${userId}`, rating)
  }

  getStarRating(videoId: number, userId: number): Observable<number>{
    return this.http.get<number>(`${Config.API_URL}/video/${videoId}/starrating/user/${userId}`)
  }

  getRatingAvgByVideo(videoId: number){
    return this.http.get<number>(`${Config.API_URL}/video/${videoId}/starrating/average`)
  }

  createVideo(video: VideoDetailDTO){
    return this.http.post<VideoDetailDTO>(`${Config.API_URL}/video/`, video)
  }

  updateVideo(video: VideoDetailDTO){
    console.log("updating video", video)
    return this.http.put<VideoDetailDTO>(`${Config.API_URL}/video/`, video)
  }

  uploadVideoFile(file: File) {
    const fileName = file.name;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<VideoFile>(`${Config.API_URL}/video/videofile?filename=${fileName}`, formData);
  }

  deleteVideoFile(fileId: number) {
    return this.http.delete(`${Config.API_URL}/video/videofile/${fileId}`);
  }

  linkVideoFile(videoId: number, fileId: number) {
    return this.http.put(`${Config.API_URL}/video/${videoId}/linkVideoFile/${fileId}`, {}, {observe: "response"})
  }
}
