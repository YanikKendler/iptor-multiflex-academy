import {Component, inject, Input, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common"
import {PlayIconComponent} from "../icons/playicon/play.icon.component"
import {BookmarkIconComponent} from "../icons/bookmark/bookmark.icon.component"
import {MatChip} from "@angular/material/chips"
import {Router} from "@angular/router"
import {VideoOverview, ViewProgressModel} from "../service/video.service";
import {VideoService} from "../service/video.service";
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
  @Input() progress: ViewProgressModel = {} as ViewProgressModel;

  constructor(private _router: Router) { }

  openVideo(){
    this._router.navigate(['video/' + this.video?.videoId])
  }

  getTimeFromSeconds(seconds: number): string {
    const date = new Date(seconds * 1000);
    const minutes = date.getUTCMinutes();
    const secs = date.getUTCSeconds();
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
