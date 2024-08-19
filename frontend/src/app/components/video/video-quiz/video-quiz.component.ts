import {AfterViewInit, Component, inject, Input, OnInit, ViewChild} from '@angular/core';
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
export class VideoQuizComponent implements OnInit, AfterViewInit {
  @Input() questions: Question[] | undefined = [];
  @Input() videoId: number = 0;

  @ViewChild(VideoQuizAnswersComponent) videoQuizAnswersComponent: VideoQuizAnswersComponent | undefined;

  questionNr: number = 0;
  checkedQuestions: Question[] = [];
  selectedQuestion: Question | null = null;

  isQuizFinished: boolean = false

  //todo when the user swaps to another page, the quiz should keep the progress

  ngOnInit() {
    // auto-select first question
    if (this.questions) {
      this.selectedQuestion = this.questions[0];
    }
  }

  ngAfterViewInit() {
    console.log("init")
    this.videoQuizAnswersComponent?.tryToGetPreviousResult(this.videoId, (result) => {
      if (result) {
        this.isQuizFinished = true;

        let count = 0;
        this.questions?.forEach(question => {
          this.checkedQuestions.push(question);
          this.videoQuizAnswersComponent?.checkedQuestions.push(count++);

          question.answerOptions.forEach(answerOption => {
            let selectedAnswers = this.videoQuizAnswersComponent?.selectedAnswers || []
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
        this.questionNr = 0
        this.checkedQuestions = []
        this.selectedQuestion = this.questions[this.questionNr]
        this.isQuizFinished = false
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
