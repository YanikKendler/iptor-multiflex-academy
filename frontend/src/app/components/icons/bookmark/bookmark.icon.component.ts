import {Component, HostBinding, Input} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBookmark as filled } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as outlined } from '@fortawesome/free-regular-svg-icons';
import {NgClass, NgStyle} from "@angular/common"
import {MatIconButton} from "@angular/material/button"
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component"

@Component({
  selector: 'app-bookmark-icon',
  standalone: true,
  imports: [FontAwesomeModule, NgStyle, MatIconButton, IconButtonComponent, NgClass],
  templateUrl: './bookmark.icon.component.html',
  styleUrl: './bookmark.icon.component.scss'
})
export class BookmarkIconComponent {
  @HostBinding('class.marked')
  @Input() marked: boolean = false;
  @Input() size: string = '1.2rem';
  @Input() color: string = 'black';

  bookmark = { filled, outlined };

  toggleMarked() {
    this.marked = !this.marked;
  }
}
