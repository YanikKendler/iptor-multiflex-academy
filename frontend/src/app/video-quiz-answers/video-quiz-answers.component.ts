import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
export class VideoQuizAnswersComponent {
  @Input() answers: AnswerOptionModel[] | undefined;
  @Input() questionText: string | undefined;
  @Input() questionNumber!: number;
  @Output() nextQuestion: EventEmitter<number> = new EventEmitter<number>()

  selectedAnswers: AnswerOptionModel[] = [];

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
    // todo currently the selected answers don't get cleared after a question is answered

    // check if all selected answers are correct and check if when nothing selected no answers are correct
    if(this.selectedAnswers.filter(a => !a.correct).length === 0 && this.selectedAnswers.length === this.answers?.filter(a => a.correct).length){
      this.nextQuestion.emit(this.questionNumber)
    }

    console.log("selected")
    console.log(this.selectedAnswers)

    console.log("only correct answers")
    console.log(this.answers?.filter(a => a.correct))
  }
}
