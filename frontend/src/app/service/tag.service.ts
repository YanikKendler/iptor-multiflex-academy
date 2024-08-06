import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

export interface TagModel{
  tagId: number
  name: string
}


@Injectable({
  providedIn: 'root'
})
export class TagService {
  http = inject(HttpClient)

  getTagList(videoId: number):Observable<TagModel[]>{
    return this.http.get<TagModel[]>("http://localhost:8080/video/" + videoId + "/tag").pipe(
      map(tagList => {
        return tagList
      })
    )
  }

  createTag(videoId: number, name: string){
    this.http.post("http://localhost:8080/video/" + videoId + "/tag", {
      name: name
    }).subscribe(response => {
      console.log('Response from server:', response);
      // Weitere Verarbeitung der Response hier
    }, error => {
      console.error('Error occurred:', error);
      // Fehlerbehandlung hier
    });
  }

  deleteTag(videoId: number, tagId: number){
    this.http.delete("http://localhost:8080/video/" + videoId + "/tag/" + tagId).subscribe(response => {
      console.log('Response from server:', response);
      // Weitere Verarbeitung der Response hier
    }, error => {
      console.error('Error occurred:', error);
      // Fehlerbehandlung hier
    });
  }
  updateTag(videoId: number, tagId: number, name: string){
    this.http.put("http://localhost:8080/video/" + videoId + "/tag/" + tagId, {
      name: name
    }).subscribe(response => {
      console.log('Response from server:', response);
      // Weitere Verarbeitung der Response hier
    }, error => {
      console.error('Error occurred:', error);
      // Fehlerbehandlung
  }
    )}
}
