import {Component, Input} from '@angular/core';
import {VideoQuizAnswersComponent} from "../video-quiz-answers/video-quiz-answers.component";
import {NgClass} from "@angular/common";
import {QuestionModel} from "../service/question.service";

@Component({
  selector: 'app-video-quiz',
  standalone: true,
  imports: [
    VideoQuizAnswersComponent,
    NgClass
  ],
  templateUrl: './video-quiz.component.html',
  styleUrl: './video-quiz.component.scss'
})
export class VideoQuizComponent {
  @Input() questions: QuestionModel[] | undefined;

  selectedQuestion: QuestionModel | undefined;

  selectQuestion(question: QuestionModel) {
    this.selectedQuestion = question;
  }
}
