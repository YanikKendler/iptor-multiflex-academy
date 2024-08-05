import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common"
import {PlayIconComponent} from "../icons/playicon/play.icon.component"
import {BookmarkIconComponent} from "../icons/bookmark/bookmark.icon.component"
import {MatChip} from "@angular/material/chips"
import {Router} from "@angular/router"

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [
    NgOptimizedImage,
    PlayIconComponent,
    BookmarkIconComponent,
    MatChip
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {
  id: number = 1;
  title: string = 'Video Title';
  description: string = 'Video Description';
  color: string = 'red';
  tags: string[] = ['tag1', 'tag2', 'tag3'];

  constructor(private _router: Router) { }

  openVideo(){
    this._router.navigate(['video/' + this.id])
  }
}
