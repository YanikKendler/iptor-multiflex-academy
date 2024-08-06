import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

export interface TagModel{
  id: number
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class TagService {
  http = inject(HttpClient)
  tagList : TagModel[] = []

  getTagList(videoId: number){
    this.http.get("http://localhost:8080/api/video/" + videoId + "/tag").subscribe(tag =>{
      return tag
    })
  }
}
