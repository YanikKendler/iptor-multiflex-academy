import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http"
import {Observable} from "rxjs"
import {ViewProgress} from "./video.service"
import {Config} from "../config"

@Injectable({
  providedIn: 'root'
})
export class ViewProgressService {
  http = inject(HttpClient)

  getViewProgress(videoId: number): Observable<ViewProgress>{
    return this.http.get<ViewProgress>(`${Config.API_URL}/api/video/${videoId}/progress/${Config.USER_ID}`)
  }

  updateViewProgress(videoId: number, progress: number) {
    return this.http.put(`${Config.API_URL}/api/video/${videoId}/progress/${Config.USER_ID}`, {
      durationSeconds: progress
    }).subscribe()
  }

  ignoreViewProgress(videoId: number) {
    return this.http.put(`${Config.API_URL}/api/video/${videoId}/progress/${Config.USER_ID}/ignore`, { }).subscribe()
  }
}
