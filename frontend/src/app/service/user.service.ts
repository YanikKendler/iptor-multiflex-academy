import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {VideoAndLearningPathOverviewCollection, VisibilityEnum} from "./video.service";
import {Config} from "../config"
import {Tag} from "./tag.service";

export interface User {
  userId: number;
  username: string;
  email: string;
}

export interface ContentForUser {
  current: VideoAndLearningPathOverviewCollection;
  assigned: VideoAndLearningPathOverviewCollection;
  suggested: VideoAndLearningPathOverviewCollection
}

export interface MyVideoContentDTO{
  contentId: number,
  title: String,
  views: number,
  rating: number,
  visibility: VisibilityEnum,
  questionCount: number,
  tags: Tag[],
  color: String
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient)

  constructor() { }

  toggleSavedVideo(videoId: number){
    return this.http.put(`http://localhost:8080/api/user/${Config.USER_ID}/togglesavedvideo/${videoId}`, {}).subscribe()
  }

  isVideoSaved(videoId: number){
    return this.http.get<boolean>(`http://localhost:8080/api/user/${Config.USER_ID}/isvideosaved/${videoId}`)
  }

  getContentForUser(){
    return this.http.get<ContentForUser>(`http://localhost:8080/api/user/${Config.USER_ID}/contentforuser`)
  }

  getUserContent(){
    return this.http.get<MyVideoContentDTO[]>(`http://localhost:8080/api/user/${Config.USER_ID}/usercontent`)
  }
}
