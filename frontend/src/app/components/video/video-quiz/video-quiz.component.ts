import {Component, Input, OnInit} from '@angular/core';
import {VideoQuizAnswersComponent} from "../video-quiz-answers/video-quiz-answers.component";
import {NgClass, NgForOf} from "@angular/common";
import {QuestionModel} from "../../../service/question.service"

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
  @Input() questions: QuestionModel[] | undefined = [];

  questionNr: number = 0;
  checkedQuestions: QuestionModel[] = [];
  selectedQuestion: QuestionModel | null = null;

  ngOnInit() {
    // auto-select first question
    if (this.questions) {
      this.selectedQuestion = this.questions[0];
    }
  }

  selectQuestion(question: QuestionModel, questionNumber: number) {
    this.selectedQuestion = question;
    this.questionNr = questionNumber
  }

  // format question number to double digits
  getFormattedQuestionNumber(questionNumber:number): string {
    return questionNumber < 10 ? `0${questionNumber}` : `${questionNumber}`;
  }

  nextQuestion() {
    if(this.questions){
      if(!this.checkedQuestions.includes(this.questions[this.questionNr])){
        this.checkedQuestions.push(this.questions[this.questionNr])
      }
      this.selectedQuestion = this.questions[++this.questionNr]
    }
  }
}
