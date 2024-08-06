import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

export interface AnswerOptionModel {
  questionOptionId: number;
  text: string;
  isCorrect: boolean;
}

export interface QuestionModel {
  questionId: number;
  answerOptions: AnswerOptionModel[];
  title: string;
  text: string;
}

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
