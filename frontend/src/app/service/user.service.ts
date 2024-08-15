import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {VideoAndLearningPathOverviewCollection} from "./video.service";
import {Config} from "../config"

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

  getContentForUser(userId: number){
    return this.http.get<ContentForUser>(`http://localhost:8080/api/user/${userId}/contentforuser`)
  }
}
