import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {VideoModel} from "../model/VideoModel";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  http = inject(HttpClient)
  videoList: VideoModel[] = []

  getVideoList(): Observable<VideoModel[]>{
    return this.http.get<VideoModel[]>("http://localhost:8080/api/video/").pipe(
      map(videoList => {
        this.videoList = videoList

        return this.videoList
      })
    )
  }

  getVideoById(id: number){
    this.getVideoList().subscribe(videoList => {
      console.log(this.videoList)
      this.videoList.forEach(video => {
        console.log(video.videoId)
      })
    })

    return this.videoList.find(video => video.videoId === id)
  }
}
