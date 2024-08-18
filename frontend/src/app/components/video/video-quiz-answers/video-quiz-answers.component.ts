import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NgClass} from "@angular/common";
import {MatRipple} from "@angular/material/core"
import {AnswerOption} from "../../../service/question.service"

@Component({
  selector: 'app-video-quiz-answers',
  standalone: true,
  imports: [
    NgClass,
    MatRipple
  ],
  templateUrl: './video-quiz-answers.component.html',
  styleUrl: './video-quiz-answers.component.scss'
})
export class VideoQuizAnswersComponent implements OnChanges{
  @Input() answers: AnswerOption[] | undefined;
  @Input() questionText: string | undefined;
  @Input() questionNumber!: number;
  @Input() isQuizFinished: boolean = false;
  @Output() nextQuestion: EventEmitter<boolean> = new EventEmitter<boolean>()

  isAnswerCheckedIn : boolean = false

  checkedQuestions: number[] = []
  selectedAnswers: AnswerOption[] = [];

  ngOnChanges(changes: SimpleChanges) {
    // i check if the question is already checked in, that way i can highlight the correct answers
    if(this.checkedQuestions.includes(this.questionNumber)) {
      this.isAnswerCheckedIn = true
    } else{
      this.isAnswerCheckedIn = false
    }
  }

  toggleAnswer(answer: AnswerOption) {
    if(this.isAnswerCheckedIn) return // if the answer is already checked in, the user shouldn't be able to change it

    if (this.selectedAnswers.includes(answer)) {
      this.selectedAnswers = this.selectedAnswers.filter(selectedAnswer => selectedAnswer !== answer);
    } else {
      this.selectedAnswers.push(answer);
    }
  }

  getFormattedQuestionNumber(): string {
    return this.questionNumber < 10 ? `0${this.questionNumber + 1}` : `${this.questionNumber + 1}`;
  }

  correctAnswers : AnswerOption[] = []
  wrongAnswers : AnswerOption[] = []
  missedAnswers : AnswerOption[] = []

  checkAnswer() {
    if(this.isQuizFinished) this.restartQuiz()

    // if answer got already logged in the function should request for the next question
    if(this.isAnswerCheckedIn){
      this.isAnswerCheckedIn = false
      this.nextQuestion.emit()
      return
    }

    // if answer isn't logged in yet, it should check every field and push the correct answers into the array
    // the correct answers get highlighted green and the others red
    this.isAnswerCheckedIn = true
    this.checkedQuestions.push(this.questionNumber)
    this.answers?.forEach(answer => {
      if(this.selectedAnswers.includes(answer) && answer.correct || !this.selectedAnswers.includes(answer) && !answer.correct){
        this.correctAnswers.push(answer)
      } else if (this.selectedAnswers.includes(answer) && !answer.correct){
        this.wrongAnswers.push(answer)
      } else {
        this.missedAnswers.push(answer)
      }
    })
  }

  restartQuiz() {
    this.checkedQuestions = []
    this.selectedAnswers = []

    this.isAnswerCheckedIn = false
    this.selectedAnswers = []
    this.correctAnswers = []
    this.wrongAnswers = []
    this.missedAnswers = []

    this.nextQuestion.emit(true)
  }
}
