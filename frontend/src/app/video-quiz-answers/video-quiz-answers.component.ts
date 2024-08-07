import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AnswerOptionModel} from "../service/question.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-video-quiz-answers',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './video-quiz-answers.component.html',
  styleUrl: './video-quiz-answers.component.scss'
})
export class VideoQuizAnswersComponent implements OnChanges{
  @Input() answers: AnswerOptionModel[] | undefined;
  @Input() questionText: string | undefined;
  @Input() questionNumber!: number;
  @Output() nextQuestion: EventEmitter<number> = new EventEmitter<number>()

  isAnswerCheckedIn : boolean = false

  checkedQuestions: number[] = []
  selectedAnswers: AnswerOptionModel[] = [];
  correctAnswers : AnswerOptionModel[] = []
  wrongAnswers : AnswerOptionModel[] = []

  ngOnChanges(changes: SimpleChanges) {
    // i check if the question is already checked in, that way i can highlight the correct answers
    if(this.checkedQuestions.includes(this.questionNumber)) {
      this.isAnswerCheckedIn = true
    } else{
      this.isAnswerCheckedIn = false
    }
  }

  toggleAnswer(answer: AnswerOptionModel) {
    if (this.selectedAnswers.includes(answer)) {
      this.selectedAnswers = this.selectedAnswers.filter(selectedAnswer => selectedAnswer !== answer);
    } else {
      this.selectedAnswers.push(answer);
    }
  }

  getFormattedQuestionNumber(): string {
    return this.questionNumber < 10 ? `0${this.questionNumber + 1}` : `${this.questionNumber + 1}`;
  }

  checkAnswer() {
    console.log("in check answer")
    // if answer got already logged in the function should request for the next question
    if(this.isAnswerCheckedIn){
      this.isAnswerCheckedIn = false
      this.nextQuestion.emit(this.questionNumber)
      return
    }

    // if answer isn't logged in yet, it should check every field and push the correct answers into the array
    // the correct answers get highlighted green and the others red
    this.isAnswerCheckedIn = true
    this.checkedQuestions.push(this.questionNumber)
    this.answers?.forEach(answer => {
      if(this.selectedAnswers.includes(answer) && answer.correct || !this.selectedAnswers.includes(answer) && !answer.correct){
        this.correctAnswers.push(answer)
      } else {
        this.wrongAnswers.push(answer)
      }
    })
  }
}
