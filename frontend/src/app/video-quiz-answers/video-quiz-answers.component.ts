import {Component, Input, OnInit} from '@angular/core';
import {AnswerOptionModel} from "../service/question.service";

@Component({
  selector: 'app-video-quiz-answers',
  standalone: true,
  imports: [],
  templateUrl: './video-quiz-answers.component.html',
  styleUrl: './video-quiz-answers.component.scss'
})
export class VideoQuizAnswersComponent{
  @Input() answers: AnswerOptionModel[] | undefined;
  @Input() questionText: string | undefined;

  selectAnswer(answer: AnswerOptionModel) {

  }
}
