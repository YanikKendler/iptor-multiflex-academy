import {Component, inject, Input, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common"
import {PlayIconComponent} from "../icons/playicon/play.icon.component"
import {BookmarkIconComponent} from "../icons/bookmark/bookmark.icon.component"
import {MatChip} from "@angular/material/chips"
import {Router} from "@angular/router"
import {VideoOverview} from "../model/VideoModel"
import {VideoService} from "../service/video.service";
import {VideoModel} from "../model/VideoModel";
import {ChipComponent} from "../chip/chip.component"

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [
    NgOptimizedImage,
    PlayIconComponent,
    BookmarkIconComponent,
    MatChip,
    ChipComponent
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {
  @Input() video: VideoOverview = {} as VideoOverview

  constructor(private _router: Router) { }

  openVideo(){
    this._router.navigate(['video/' + this.video?.videoId])
  }
}
