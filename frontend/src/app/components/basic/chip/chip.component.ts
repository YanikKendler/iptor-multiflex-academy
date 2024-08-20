import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome"
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {IconButtonComponent} from "../icon-button/icon-button.component"


@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [
    FaIconComponent,
    IconButtonComponent
  ],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss'
})
export class ChipComponent{
  @Input() removable = false;
  @Output() onRemove = new EventEmitter<void>();

  remove(event: Event): void {
    event.stopPropagation()
    this.onRemove.emit()
  }

  protected readonly faXmark = faXmark
}
