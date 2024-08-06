import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class QuestionService {
  http = inject(HttpClient)



  getQuestionList(videoId: number){
    this.http.get("http://localhost:8080/api/video/" + videoId + "/question").pipe(
    )
  }

  getVideo(id: number){
    this.http.get("http://localhost:8080/api/video/" + id).subscribe(video =>{
    })
  }
}
