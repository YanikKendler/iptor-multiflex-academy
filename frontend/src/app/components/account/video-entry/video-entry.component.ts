import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LearningPathEntryDTO} from "../../../service/learning-path.service"
import {Utils} from "../../../utils"
import {faAngleDown, faAngleUp, faXmark} from "@fortawesome/free-solid-svg-icons"
import {FaIconComponent} from "@fortawesome/angular-fontawesome"
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component"

@Component({
  selector: 'app-video-entry',
  standalone: true,
  imports: [
    FaIconComponent,
    IconButtonComponent
  ],
  templateUrl: './video-entry.component.html',
  styleUrl: './video-entry.component.scss'
})
export class VideoEntryComponent {
  @Input() position: number = -1;
  @Output() positionUpdated = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<void>();
  @Input() videoEntry: LearningPathEntryDTO = {} as LearningPathEntryDTO;

  moveEntry(direction: number){
    this.positionUpdated.emit(direction)
  }

  deleteEntry(){
    this.onDelete.emit()
  }

  protected readonly Utils = Utils
  protected readonly faAngleUp = faAngleUp
  protected readonly faAngleDown = faAngleDown
  protected readonly faXmark = faXmark
}
