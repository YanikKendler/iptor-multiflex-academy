import {Component, Input} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBookmark as filled } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as outlined } from '@fortawesome/free-regular-svg-icons';
import {NgStyle} from "@angular/common"

@Component({
  selector: 'app-bookmark-icon',
  standalone: true,
  imports: [FontAwesomeModule, NgStyle],
  templateUrl: './bookmark.icon.component.html',
  styleUrl: './bookmark.icon.component.scss'
})
export class BookmarkIconComponent {
  @Input() marked: boolean = false;
  @Input() size: string = '1.2rem';
  @Input() color: string = 'black';
  bookmark = { filled, outlined };
}
