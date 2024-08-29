import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input, NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {NgClass} from "@angular/common";
import {MatRipple} from "@angular/material/core"
import {AnswerOption, VideoService} from "../../../service/video.service";
import {MatButton} from "@angular/material/button";
import {Utils} from "../../../utils"

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
export class VideoQuizAnswersComponent implements OnChanges {
  @Input() answers: AnswerOption[] | undefined;
  @Input() questionText: string | undefined;
  @Input() questionNumber!: number;
  @Input() isQuizFinished: boolean = false;
  @Input() inLearningPath: boolean = false;
  @Input() isLastVideo: boolean = false
  @Output() nextQuestion: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() nextVideo: EventEmitter<any> = new EventEmitter()
  @Output() giveSelectedAnswers: EventEmitter<AnswerOption[]> = new EventEmitter<AnswerOption[]>()

  constructor(private cdr: ChangeDetectorRef) {
  }

  answerIsSubmitted : boolean = false

  checkedQuestions: number[] = []
  selectedAnswers: AnswerOption[] = [];

  notSelectedButCorrectAnswers : AnswerOption[] = []
  correctAnswers : AnswerOption[] = []
  wrongAnswers : AnswerOption[] = []
  missedAnswers : AnswerOption[] = []

  ngOnChanges(changes: SimpleChanges) {
    console.log(this)

    // check if the question is already checked, that way i can highlight the correct answers
    if(this.checkedQuestions.includes(this.questionNumber)) {
      this.answerIsSubmitted = true
    } else{
      this.answerIsSubmitted = false
    }
  }

  toggleAnswer(answer: AnswerOption) {
    if(this.answerIsSubmitted) return // if the answer is already checked in, the user shouldn't be able to change it

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
    if(this.isQuizFinished) this.restartQuiz()

    // if answer got already submitted the function should request the next question
    if(this.answerIsSubmitted){
      this.answerIsSubmitted = false
      sessionStorage.setItem("itm_answer_is_submitted", this.answerIsSubmitted.toString())
      this.nextQuestion.emit()
      return
    }

    // if answer isn't submitted yet, it should check every field and push the correct answers into the array
    // the correct answers get highlighted green and the others red
    this.answerIsSubmitted = true
    this.checkedQuestions.push(this.questionNumber)
    this.answers?.forEach(answer => {
      if(this.selectedAnswers.includes(answer) && answer.isCorrect){
        this.correctAnswers.push(answer)
      } else if(!this.selectedAnswers.includes(answer) && !answer.isCorrect){
        this.notSelectedButCorrectAnswers.push(answer)
      } else if (this.selectedAnswers.includes(answer) && !answer.isCorrect){
        this.wrongAnswers.push(answer)
      } else if (!this.selectedAnswers.includes(answer) && answer.isCorrect){
        this.missedAnswers.push(answer)
      }
    })

    sessionStorage.setItem("itm_correct_answers", JSON.stringify(this.correctAnswers))
    sessionStorage.setItem("itm_not_selected_but_correct_answers", JSON.stringify(this.notSelectedButCorrectAnswers))
    sessionStorage.setItem("itm_wrong_answers", JSON.stringify(this.wrongAnswers))
    sessionStorage.setItem("itm_missed_answers", JSON.stringify(this.missedAnswers))
    sessionStorage.setItem("itm_selected_answers", JSON.stringify(this.selectedAnswers))
    sessionStorage.setItem("itm_answer_is_submitted", this.answerIsSubmitted.toString())
    sessionStorage.setItem("itm_checked_questions", JSON.stringify(this.checkedQuestions))
  }

  videoService = inject(VideoService)
  finishQuiz(videoId: number) {
    this.videoService.finishQuiz(videoId, this.correctAnswers.length + this.notSelectedButCorrectAnswers.length, this.selectedAnswers)
  }

  restartQuiz() {
    this.resetQuiz()
    this.nextQuestion.emit(true)
  }

  resetQuiz() {
    this.checkedQuestions = []
    this.selectedAnswers = []

    this.answerIsSubmitted = false
    this.selectedAnswers = []

    /**
     * answer was not selected and was not correct, so the user did the right thing
     */
    this.notSelectedButCorrectAnswers = []
    /**
     * answer was selected and was correct
     */
    this.correctAnswers = []
    /**
     * answer was selected and was not correct
     */
    this.wrongAnswers = []
    /**
     * answer was not selected and was correct, so the user did the wrong thing
     */
    this.missedAnswers = []
  }

  calculateScoreInDecimal() {
    if(this.notSelectedButCorrectAnswers.length + this.correctAnswers.length + this.wrongAnswers.length + this.missedAnswers.length === 0) return -1
    let totalQuestionCount = (this.correctAnswers.length + this.wrongAnswers.length + this.missedAnswers.length + this.notSelectedButCorrectAnswers.length)
    return (this.correctAnswers.length + this.notSelectedButCorrectAnswers.length) / totalQuestionCount
  }

  tryToGetSessionStorage() {
    if(sessionStorage.getItem("itm_correct_answers")) {
      this.correctAnswers = JSON.parse(sessionStorage.getItem("itm_correct_answers") || "[]")
      this.notSelectedButCorrectAnswers = JSON.parse(sessionStorage.getItem("itm_not_selected_but_correct_answers") || "[]")
      this.wrongAnswers = JSON.parse(sessionStorage.getItem("itm_wrong_answers") || "[]")
      this.missedAnswers = JSON.parse(sessionStorage.getItem("itm_missed_answers") || "[]")
      this.selectedAnswers = JSON.parse(sessionStorage.getItem("itm_selected_answers") || "[]")
      this.answerIsSubmitted = JSON.parse(sessionStorage.getItem("itm_answer_is_submitted") || "false")
    }
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
      callback(false);
    });
  }

  protected readonly Utils = Utils

  getClassForAnswer(answer: AnswerOption) {
    if (this.correctAnswers.some(correctAnswer => correctAnswer.answerOptionId === answer.answerOptionId)) {
      return 'correct';
    } else if (this.wrongAnswers.some(wrongAnswer => wrongAnswer.answerOptionId === answer.answerOptionId)) {
      return 'wrong';
    } else if (this.missedAnswers.some(missedAnswer => missedAnswer.answerOptionId === answer.answerOptionId)) {
      return 'missing';
    }

    if (this.selectedAnswers.some(selectedAnswer => selectedAnswer.answerOptionId === answer.answerOptionId)) {
      return 'selected';
    }

    return '';
  }
}
