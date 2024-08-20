import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NgClass} from "@angular/common";
import {MatRipple} from "@angular/material/core"
import {AnswerOption} from "../../../service/question.service"
import {VideoService} from "../../../service/video.service";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-video-quiz-answers',
  standalone: true,
  imports: [
    NgClass,
    MatRipple,
    MatButton
  ],
  templateUrl: './video-quiz-answers.component.html',
  styleUrl: './video-quiz-answers.component.scss'
})
export class VideoQuizAnswersComponent implements OnChanges{
  @Input() answers: AnswerOption[] | undefined;
  @Input() questionText: string | undefined;
  @Input() questionNumber!: number;
  @Input() isQuizFinished: boolean = false;
  @Input() inLearningPath: boolean = false;
  @Input() isLastVideo: boolean = false
  @Output() nextQuestion: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() nextVideo: EventEmitter<any> = new EventEmitter()
  @Output() giveSelectedAnswers: EventEmitter<AnswerOption[]> = new EventEmitter<AnswerOption[]>()

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
      if(this.selectedAnswers.includes(answer) && answer.isCorrect || !this.selectedAnswers.includes(answer) && !answer.isCorrect){
        this.correctAnswers.push(answer)
      } else if (this.selectedAnswers.includes(answer) && !answer.isCorrect){
        this.wrongAnswers.push(answer)
      } else {
        this.missedAnswers.push(answer)
      }
    })

    this.giveSelectedAnswers.emit(this.selectedAnswers)
  }

  videoService = inject(VideoService)
  finishQuiz(videoId: number) {
    this.videoService.finishQuiz(videoId, this.correctAnswers.length, this.selectedAnswers)
  }

  restartQuiz() {
    this.resetQuiz()
    this.nextQuestion.emit(true)
  }

  resetQuiz() {
    this.checkedQuestions = []
    this.selectedAnswers = []

    this.isAnswerCheckedIn = false
    this.selectedAnswers = []
    this.correctAnswers = []
    this.wrongAnswers = []
    this.missedAnswers = []
  }

  calculateScoreInPercent() {
    if(this.correctAnswers.length + this.wrongAnswers.length + this.missedAnswers.length === 0) return -1
    return this.correctAnswers.length / (this.correctAnswers.length + this.wrongAnswers.length + this.missedAnswers.length)
  }

  tryToGetPreviousResult(videoId: number, callback: (result: boolean) => void) {
    this.videoService.getQuizResults(videoId).subscribe(result => {
      if (result && result.selectedAnswers) {
        this.selectedAnswers = result.selectedAnswers;
        callback(true);
      } else {
        callback(false);
        this.selectedAnswers = [];
      }
    }, error => {
      console.log(error);
      callback(false);
    });
  }
}
