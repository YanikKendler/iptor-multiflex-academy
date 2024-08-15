import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

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

  toggleSavedVideo(videoId: number, userId: number){
    return this.http.put(`http://localhost:8080/api/user/${userId}/togglesavedvideo/${videoId}`, {}).subscribe()
  }

  isVideoSaved(videoId: number, userId: number){
    return this.http.get<boolean>(`http://localhost:8080/api/user/${userId}/isvideosaved/${videoId}`)
  }
}
