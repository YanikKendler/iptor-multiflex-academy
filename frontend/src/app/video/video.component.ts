import {Component, inject, Input, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common"
import {PlayIconComponent} from "../icons/playicon/play.icon.component"
import {BookmarkIconComponent} from "../icons/bookmark/bookmark.icon.component"
import {MatChip} from "@angular/material/chips"
import {Router} from "@angular/router"
import {VideoService} from "../service/video.service";
import {VideoModel} from "../model/VideoModel";

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
export class VideoComponent{
  service = inject(VideoService)

  @Input() video : VideoModel | undefined

  constructor(private _router: Router) { }

  openVideo(){
    this._router.navigate(['video/' + this.video?.videoId])
  }
}
