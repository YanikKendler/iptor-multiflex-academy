import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

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

  getQuestionList(videoId: number): Observable<QuestionModel[]>{
    return this.http.get<QuestionModel[]>("http://localhost:8080/api/video/" + videoId + "/question").pipe(
      map(commentList => {
        return commentList
      })
    )
  }

  createQuestion(videoId: number, title: string, text: string, answerOptions: AnswerOptionModel[]){
    this.http.post("http://localhost:8080/api/video/" + videoId + "/question", {
      title: title,
      text: text,
      answerOptions: answerOptions
    }).subscribe(response =>{
      console.log('Response from server:', response);
      // Weitere Verarbeitung der Response hier
    }, error => {
      console.error('Error occurred:', error);
      // Fehlerbehandlung hier
    });
  }

  deleteQuestion(videoId: number, questionId: number){
    this.http.delete("http://localhost:8080/api/video/" + videoId + "/question/" + questionId).subscribe(response => {
      console.log('Response from server:', response);
      // Weitere Verarbeitung der Response hier
    }, error => {
      console.error('Error occurred:', error);
      // Fehlerbehandlung hier
    });
  }

  updateQuestion(videoId: number, questionId: number, title: string, text: string, answerOptions: AnswerOptionModel[]) {
    this.http.put("http://localhost:8080/api/video/" + videoId + "/question/" + questionId, {
      title: title,
      text: text,
      answerOptions: answerOptions
    }).subscribe(response => {
      console.log('Response from server:', response);
      // Weitere Verarbeitung der Response hier
    }, error => {
      console.error('Error occurred:', error);
      // Fehlerbehandlung
    });
  }

  addAnswerOption(videoId: number, questionId: number, text: string, isCorrect: boolean){
    this.http.post("http://localhost:8080/api/video/" + videoId + "/question/" + questionId + "/answeroption", {
      text: text,
      isCorrect: isCorrect
    }).subscribe(response => {
      console.log('Response from server:', response);
      // Weitere Verarbeitung der Response hier
    }, error => {
      console.error('Error occurred:', error);
      // Fehlerbehandlung
    });
  }

  deleteAnswerOption(videoId: number, questionId: number, text: string, isCorrect: boolean){
    this.http.delete("http://localhost:8080/api/video/" + videoId + "/question/" + questionId + "/answeroption/").subscribe(response => {
      console.log('Response from server:', response);
      // Weitere Verarbeitung der Response hier
    }, error => {
      console.error('Error occurred:', error);
      // Fehlerbehandlung
    });
  }

}
