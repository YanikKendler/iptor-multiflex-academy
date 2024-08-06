import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import {VideoModel, VideoOverview} from "../model/VideoModel";

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
}
