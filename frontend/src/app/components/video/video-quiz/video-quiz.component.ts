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
import {AnswerOption, Question} from "../../../service/question.service"
import {VideoService} from "../../../service/video.service";

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

  //todo when the user swaps to another page, the quiz should keep the progress

  ngOnChanges() {
    this.resetQuiz()
    this.tryToGetPreviousResult()
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
      return;
    } else {
      this.selectedQuestion = this.questions[0];
    }

    this.tryToGetPreviousResult()
  }

  tryToGetPreviousResult() {
    this.videoQuizAnswersComponent?.tryToGetPreviousResult(this.videoId, (result) => {
      if (result) {
        this.isQuizFinished = true;

        let count = 0;
        this.questions?.forEach(question => {
          this.checkedQuestions.push(question);
          this.videoQuizAnswersComponent?.checkedQuestions.push(count++);

          question.answerOptions.forEach(answerOption => {
            let selectedAnswers = this.videoQuizAnswersComponent?.selectedAnswers || [];
            if (answerOption.isCorrect && selectedAnswers.some(selected => selected.answerOptionId === answerOption.answerOptionId) ||
              !answerOption.isCorrect && !selectedAnswers.some(selected => selected.answerOptionId === answerOption.answerOptionId)) {
              this.videoQuizAnswersComponent?.correctAnswers.push(answerOption);
            } else if (!answerOption.isCorrect && selectedAnswers.some(selected => selected.answerOptionId === answerOption.answerOptionId)) {
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
        this.viewResults()

        this.videoQuizAnswersComponent?.finishQuiz(this.videoId)
        return
      }

      if(!this.checkedQuestions.includes(this.questions[this.questionNr])){
        this.checkedQuestions.push(this.questions[this.questionNr])
      }
      this.selectedQuestion = this.questions[++this.questionNr]
    }
  }
}
