import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TextfieldComponent} from "../../basic/textfield/textfield.component"
import {AnswerOption} from "../../../service/question.service"
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox"

@Component({
  selector: 'app-answer-option',
  standalone: true,
  imports: [
    TextfieldComponent,
    MatCheckbox
  ],
  templateUrl: './answer-option.component.html',
  styleUrl: './answer-option.component.scss'
})
export class AnswerOptionComponent {
  @Input() answer: AnswerOption = {} as AnswerOption;
  @Output() answerChange: EventEmitter<AnswerOption> = new EventEmitter<AnswerOption>()
  @Input() letter: string = "";

  updateIsCorrect(change: MatCheckboxChange) {
    this.answer.correct = change.checked;
    this.answerChange.emit(this.answer);
  }
}
