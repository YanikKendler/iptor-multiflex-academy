import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http"
import {Observable} from "rxjs"
import {ViewProgress} from "./video.service"
import {Config} from "../config"
import {UserService} from "./user.service"

@Injectable({
  providedIn: 'root'
})
export class ViewProgressService {
  http = inject(HttpClient)
  userService = inject(UserService)

  getViewProgress(videoId: number): Observable<ViewProgress>{
    return this.http.get<ViewProgress>(`${Config.API_URL}/video/${videoId}/progress/${this.userService.currentUser.value.userId}`)
  }

  updateViewProgress(videoId: number, progress: number) {
    return this.http.put(`${Config.API_URL}/video/${videoId}/progress/${this.userService.currentUser.value.userId}`, {
      durationSeconds: progress
    }).subscribe()
  }

  ignoreViewProgress(videoId: number) {
    return this.http.put(`${Config.API_URL}/video/${videoId}/progress/${this.userService.currentUser.value.userId}/ignore`, { }).subscribe()
  }
}
