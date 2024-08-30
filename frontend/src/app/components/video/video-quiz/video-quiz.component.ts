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

  questionNr: number = 0; // current question nr (not id)
  checkedQuestions: Question[] = []; // questions that have been answered
  selectedQuestion: Question | null = null; // current question

  isQuizFinished: boolean = false

  ngOnChanges() {
    this.resetQuiz()
  }

  resetQuiz() {
    this.questionNr = 0
    this.checkedQuestions = []
    this.isQuizFinished = false
    this.selectedQuestion = this.questions ? this.questions[0] : null
    this.videoQuizAnswersComponent?.resetQuiz()

    if(!this.tryToGetSessionStorage()){
      this.tryToGetPreviousResult()
    }
  }

  ngAfterViewInit() {
    // if the question is empty, the quiz is finished
    if (!this.questions || this.questions.length === 0) {
      this.nextQuestion(true); // restart quiz
      this.isQuizFinished = true;
      return;
    } else {
      // select first question
      this.resetQuiz()
    }
  }

  /**
   * Try to get a started quiz progress from session storage
   * if there is a progress the quiz will start with the saved progress
   */
  tryToGetSessionStorage() {
    if(sessionStorage.getItem("itm_checked_questions") && sessionStorage.getItem("itm_selected_question_nr")){
      // set all questions that were already done
      this.checkedQuestions = JSON.parse(sessionStorage.getItem("itm_checked_questions") || "[]")

      if (this.questions) {
        // set the selected question and question number
        this.selectedQuestion = this.questions[JSON.parse(sessionStorage.getItem("itm_selected_question_nr") || "null")]
        this.questionNr = JSON.parse(sessionStorage.getItem("itm_selected_question_nr") || "null")
      }

      let count = 0;
      this.checkedQuestions.forEach(() => {
        // set the checked questions in the videoQuizAnswersComponent
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
   * unless the user has current progress in the session storage
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

  /**
   * select a question by clicking on it
   */
  selectQuestion(question: Question, questionNumber: number) {
    this.selectedQuestion = question;
    this.questionNr = questionNumber
  }

  /**
   * format question number to double digits
   * */
  getFormattedQuestionNumber(questionNumber:number): string {
    return questionNumber < 10 ? `0${questionNumber}` : `${questionNumber}`;
  }

  viewResults() {
    // when selected question is null, the results are shown
    this.selectedQuestion = null
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

      // quiz is finished
      if(this.questionNr >= this.questions.length - 1){
        this.isQuizFinished = true
        this.clearSessionStorage();
        this.viewResults()

        // alert the child component that the quiz is finished
        this.videoQuizAnswersComponent?.finishQuiz(this.videoId)
        return
      }

      // if the question isn't already checked, push it into the array
      if(!this.checkedQuestions.includes(this.questions[this.questionNr])){
        this.checkedQuestions.push(this.questions[this.questionNr])
      }

      // select the next question
      this.selectedQuestion = this.questions[++this.questionNr]

      // save the current progress in session storage
      sessionStorage.setItem("itm_checked_questions", JSON.stringify(this.checkedQuestions))
      sessionStorage.setItem("itm_selected_question_nr", this.questionNr.toString())
    }
  }

  clearSessionStorage(){
    sessionStorage.removeItem("itm_correct_answers")
    sessionStorage.removeItem("itm_not_selected_but_correct_answers")
    sessionStorage.removeItem("itm_wrong_answers")
    sessionStorage.removeItem("itm_missed_answers")
    sessionStorage.removeItem("itm_checked_questions")
    sessionStorage.removeItem("itm_selected_question_nr")
  }
}
