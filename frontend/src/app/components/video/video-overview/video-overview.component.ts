import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {NgOptimizedImage} from "@angular/common"
import {PlayIconComponent} from "../../icons/playicon/play.icon.component"
import {BookmarkIconComponent} from "../../icons/bookmark/bookmark.icon.component"
import {MatChip} from "@angular/material/chips"
import {Router} from "@angular/router"
import {MatTooltip} from "@angular/material/tooltip"
import {RemoveIconComponent} from "../../icons/remove-icon/remove-icon.component"
import {ChipComponent} from "../../basic/chip/chip.component"
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component"
import {VideoOverviewDTO} from "../../../service/video.service"
import { Utils } from '../../../utils';
import {UserService} from "../../../service/user.service";
import {ViewProgressService} from "../../../service/view-progress.service"

@Component({
  selector: 'app-video-overview',
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
  templateUrl: './video-overview.component.html',
  styleUrl: './video-overview.component.scss',
})
export class VideoOverviewComponent implements OnInit{
  @Input() video: VideoOverviewDTO = {} as VideoOverviewDTO
  @Input() removable: boolean = true
  @Output() updateDashboard: EventEmitter<any> = new EventEmitter<any>()

  userService = inject(UserService)
  viewProgressService = inject(ViewProgressService)

  tagToolTipString: string = "Tags"
  @ViewChild("bookmark") bookmark: BookmarkIconComponent | undefined

  constructor(private _router: Router) {
  }

  ngOnInit(): void {
    this.tagToolTipString = this.video.tags?.map(tag => tag.name).join(", ")

    this.userService.isVideoSaved(this.video.contentId).subscribe(isSaved => {
      if(isSaved){
        this.bookmark?.toggleMarked()
      }
    })
  }

  @HostListener('click', ['$event'])
  openVideo(){
    this._router.navigate(['video/' + this.video?.contentId])
  }

  addToBookmarks(event: MouseEvent){
    event.stopPropagation();
    this.bookmark?.toggleMarked()
    console.log("Added to bookmarks")

    this.userService.toggleSavedVideo(this.video.contentId)
    this.updateDashboard.emit()
  }

  removeSuggestion(event: MouseEvent) {
    event.stopPropagation();

    this.viewProgressService.ignoreViewProgress(this.video.contentId)
    console.log("Removed suggestion")
    this.updateDashboard.emit()
  }

  protected readonly Utils = Utils
}
