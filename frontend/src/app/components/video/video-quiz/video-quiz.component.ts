import {Component, Input, OnInit} from '@angular/core';
import {VideoQuizAnswersComponent} from "../video-quiz-answers/video-quiz-answers.component";
import {NgClass, NgForOf} from "@angular/common";
import {Question} from "../../../service/question.service"

@Component({
  selector: 'app-video-quiz',
  standalone: true,
  imports: [
    VideoQuizAnswersComponent,
    NgClass,
    NgForOf
  ],
  templateUrl: './video-quiz.component.html',
  styleUrl: './video-quiz.component.scss'
})
export class VideoQuizComponent implements OnInit {
  @Input() questions: Question[] | undefined = [];

  questionNr: number = 0;
  checkedQuestions: Question[] = [];
  selectedQuestion: Question | null = null;

  isQuizFinished: boolean = false

  ngOnInit() {
    // auto-select first question
    if (this.questions) {
      this.selectedQuestion = this.questions[0];
    }
  }

  selectQuestion(question: Question, questionNumber: number) {
    this.selectedQuestion = question;
    this.questionNr = questionNumber
  }

  // format question number to double digits
  getFormattedQuestionNumber(questionNumber:number): string {
    return questionNumber < 10 ? `0${questionNumber}` : `${questionNumber}`;
  }

  viewResults() {
    this.selectedQuestion = null
  }

  nextQuestion(isRestart: boolean = false) {
    if(this.questions){
      if(isRestart){
        this.questionNr = 0
        this.checkedQuestions = []
        this.selectedQuestion = this.questions[this.questionNr]
        this.isQuizFinished = false
        return
      }

      if(this.questionNr >= this.questions.length - 1){
        this.isQuizFinished = true
        this.viewResults()
        return
      }

      if(!this.checkedQuestions.includes(this.questions[this.questionNr])){
        this.checkedQuestions.push(this.questions[this.questionNr])
      }
      this.selectedQuestion = this.questions[++this.questionNr]
    }
  }
}
