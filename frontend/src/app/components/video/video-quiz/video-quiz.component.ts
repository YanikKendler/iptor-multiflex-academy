import {
  AfterViewInit,
  Component, EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {VideoQuizAnswersComponent} from "../video-quiz-answers/video-quiz-answers.component";
import {NgClass, NgForOf} from "@angular/common";
import {Question, VideoService} from "../../../service/video.service";

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
export class VideoQuizComponent implements AfterViewInit, OnChanges{
  @Input() questions: Question[] | undefined = [];
  @Input() videoId: number = 0;
  @Input() inLearningPath: boolean = false;
  @Input() isLastVideo: boolean = false;
  @Output() nextVideo: EventEmitter<any> = new EventEmitter()

  @ViewChild(VideoQuizAnswersComponent) videoQuizAnswersComponent: VideoQuizAnswersComponent | undefined;

  questionNr: number = 0;
  checkedQuestions: Question[] = [];
  selectedQuestion: Question | null = null;

  isQuizFinished: boolean = false

  ngOnChanges() {
    this.resetQuiz()
    if(!this.tryToGetSessionStorage()){
      this.tryToGetPreviousResult()
    }
  }

  constructor() {
    if(!this.tryToGetSessionStorage()){
      this.tryToGetPreviousResult()
    }
  }

  resetQuiz() {
    this.questionNr = 0
    this.checkedQuestions = []
    this.isQuizFinished = false
    this.selectedQuestion = this.questions ? this.questions[0] : null
    this.videoQuizAnswersComponent?.resetQuiz()
  }

  ngAfterViewInit() {
    if (!this.questions || this.questions.length === 0) {
      this.nextQuestion(true);
      this.isQuizFinished = true;
      return;
    } else {
      this.selectedQuestion = this.questions[0];
    }

    if(!this.tryToGetSessionStorage()){
      this.tryToGetPreviousResult()
    }
  }

  tryToGetSessionStorage() {
    if(sessionStorage.getItem("itm_checked_questions") && sessionStorage.getItem("itm_selected_question_nr")){
      this.checkedQuestions = JSON.parse(sessionStorage.getItem("itm_checked_questions") || "[]")
      if (this.questions) {
        this.selectedQuestion = this.questions[JSON.parse(sessionStorage.getItem("itm_selected_question_nr") || "null")]
        this.questionNr = JSON.parse(sessionStorage.getItem("itm_selected_question_nr") || "null")
      }


      let count = 0;
      this.checkedQuestions.forEach(() => {
        this.videoQuizAnswersComponent?.checkedQuestions.push(count++);
      })
      this.videoQuizAnswersComponent?.tryToGetSessionStorage()

      return true;
    }

    return false;
  }

  /**
   * Try to get previous result from database
   * if the user has already finished the quiz once before the quiz starts with the results of the saved quiz
   */
  tryToGetPreviousResult() {
    this.videoQuizAnswersComponent?.tryToGetPreviousResult(this.videoId, (result) => {
      if (result) {
        this.isQuizFinished = true;

        let count = 0;
        this.questions?.forEach(question => {
          this.checkedQuestions.push(question);
          this.videoQuizAnswersComponent?.checkedQuestions.push(count++);

          question.answerOptions?.forEach(answerOption => {
            let selectedAnswers = this.videoQuizAnswersComponent?.selectedAnswers || [];
            if (answerOption.isCorrect && selectedAnswers.some(selected => selected.answerOptionId === answerOption.answerOptionId)) {
              this.videoQuizAnswersComponent?.correctAnswers.push(answerOption);
            } else if(!answerOption.isCorrect && !selectedAnswers.some(selected => selected.answerOptionId === answerOption.answerOptionId)){
              this.videoQuizAnswersComponent?.notSelectedButCorrectAnswers.push(answerOption);
            }else if (!answerOption.isCorrect && selectedAnswers.some(selected => selected.answerOptionId === answerOption.answerOptionId)) {
              this.videoQuizAnswersComponent?.wrongAnswers.push(answerOption);
            } else {
              this.videoQuizAnswersComponent?.missedAnswers.push(answerOption);
            }
          });
        });

        this.selectedQuestion = null;
      }
    });
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

  clearSessionStorage(){
    sessionStorage.removeItem("itm_correct_answers")
    sessionStorage.removeItem("itm_not_selected_but_correct_answers")
    sessionStorage.removeItem("itm_wrong_answers")
    sessionStorage.removeItem("itm_missed_answers")
    sessionStorage.removeItem("itm_checked_questions")
    sessionStorage.removeItem("itm_selected_question_nr")
  }

  nextQuestion(isRestart: boolean = false) {
    if(this.questions){
      if(isRestart){
        this.questionNr = 0;
        this.checkedQuestions = [];
        this.isQuizFinished = false;
        this.selectedQuestion = this.questions[this.questionNr]
        return
      }

      if(this.questionNr >= this.questions.length - 1){
        this.isQuizFinished = true
        this.clearSessionStorage();
        this.viewResults()

        this.videoQuizAnswersComponent?.finishQuiz(this.videoId)
        return
      }

      if(!this.checkedQuestions.includes(this.questions[this.questionNr])){
        this.checkedQuestions.push(this.questions[this.questionNr])
      }
      this.selectedQuestion = this.questions[++this.questionNr]

      sessionStorage.setItem("itm_checked_questions", JSON.stringify(this.checkedQuestions))
      sessionStorage.setItem("itm_selected_question_nr", this.questionNr.toString())
    }
  }
}
