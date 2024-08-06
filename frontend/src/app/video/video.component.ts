import {Component, ElementRef, HostListener, inject, Input, OnInit, ViewChild} from '@angular/core';
import {NgOptimizedImage} from "@angular/common"
import {PlayIconComponent} from "../icons/playicon/play.icon.component"
import {BookmarkIconComponent} from "../icons/bookmark/bookmark.icon.component"
import {MatChip} from "@angular/material/chips"
import {Router} from "@angular/router"
import {VideoOverview} from "../model/VideoModel"
import {VideoService} from "../service/video.service";
import {VideoModel} from "../model/VideoModel";
import {ChipComponent} from "../chip/chip.component"
import {MatTooltip} from "@angular/material/tooltip"
import {IconButtonComponent} from "../icon-button/icon-button.component"
import {RemoveIconComponent} from "../icons/remove-icon/remove-icon.component"

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [
    NgOptimizedImage,
    PlayIconComponent,
    BookmarkIconComponent,
    MatChip,
    ChipComponent,
    MatTooltip,
    IconButtonComponent,
    RemoveIconComponent
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss',
})
export class VideoComponent implements OnInit{
  @Input() video: VideoOverview = {} as VideoOverview
  @Input() removable: boolean = true

  toolTipString: string = "Tags"
  @ViewChild("bookmark") bookmark: BookmarkIconComponent | undefined

  constructor(private _router: Router) {
  }

  @HostListener('click', ['$event'])
  openVideo(){
    this._router.navigate(['video/' + this.video?.videoId])
  }

  ngOnInit(): void {
    this.toolTipString = this.video.tags?.map(tag => tag.name).join(", ")
  }

  addToBookmarks(event: MouseEvent){
    event.stopPropagation();
    this.bookmark?.toggleMarked()
    console.log("Added to bookmarks")
  }

  removeSuggestion(event: MouseEvent) {
    event.stopPropagation();
    console.log("Removed suggestion")
  }
}
