import { Component } from '@angular/core';
import {NavigationComponent} from "../navigation/navigation.component"
import {StarIconComponent} from "../icons/star/star.icon.component"
import {BookmarkIconComponent} from "../icons/bookmark/bookmark.icon.component"

@Component({
  selector: 'app-view-video',
  standalone: true,
  imports: [
    NavigationComponent,
    StarIconComponent,
    BookmarkIconComponent
  ],
  templateUrl: './view-video.component.html',
  styleUrl: './view-video.component.scss'
})
export class ViewVideoComponent {
  title: string = 'Video Title';
  description: string = 'Video Description';
}
