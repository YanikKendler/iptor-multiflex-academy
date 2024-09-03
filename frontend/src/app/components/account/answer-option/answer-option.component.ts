import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TextfieldComponent} from "../../basic/textfield/textfield.component"
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox"
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component"
import {MatTooltip} from "@angular/material/tooltip"
import {AnswerOption} from "../../../service/video.service"
import {FaIconComponent} from "@fortawesome/angular-fontawesome"
import {faTrash, faXmark} from "@fortawesome/free-solid-svg-icons"

@Component({
  selector: 'app-answer-option',
  standalone: true,
  imports: [
    TextfieldComponent,
    MatCheckbox,
    IconButtonComponent,
    MatTooltip,
    FaIconComponent
  ],
  templateUrl: './answer-option.component.html',
  styleUrl: './answer-option.component.scss'
})
export class AnswerOptionComponent {
  @Input() answer: AnswerOption = {} as AnswerOption
  @Output() answerChange: EventEmitter<AnswerOption> = new EventEmitter<AnswerOption>()
  @Input() letter: string = ""
  @Output() remove: EventEmitter<AnswerOption> = new EventEmitter<AnswerOption>()

  updateIsCorrect(change: MatCheckboxChange) {
    this.answer.isCorrect = change.checked
    this.answerChange.emit(this.answer)
  }

  updatedAnswerText(text: string) {
    this.answer.text = text
    this.answerChange.emit(this.answer)
  }

  removeAnswer() {
    this.remove.emit(this.answer)
  }

  protected readonly faXmark = faXmark
}
