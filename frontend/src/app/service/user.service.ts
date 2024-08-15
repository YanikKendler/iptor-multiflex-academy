import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Config} from "../config"

export interface User {
  userId: number;
  username: string;
  email: string;
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
}
