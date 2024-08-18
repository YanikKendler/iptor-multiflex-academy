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
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {PlayIconComponent} from "../../icons/playicon/play.icon.component";

export interface UpdateVideoDashboardEvent {
  video: VideoOverviewDTO;
  action: "add" | "remove";
}

@Component({
  selector: 'app-video-overview',
  standalone: true,
  imports: [
    NgOptimizedImage,
    BookmarkIconComponent,
    MatChip,
    ChipComponent,
    MatTooltip,
    IconButtonComponent,
    RemoveIconComponent,
    FaIconComponent,
    PlayIconComponent
  ],
  templateUrl: './video-overview.component.html',
  styleUrl: './video-overview.component.scss',
})
export class VideoOverviewComponent implements OnInit{
  @Input() video: VideoOverviewDTO = {} as VideoOverviewDTO
  @Input() removable: boolean = false
  @Output() updateDashboard: EventEmitter<UpdateVideoDashboardEvent> = new EventEmitter<UpdateVideoDashboardEvent>();

  userService = inject(UserService)
  viewProgressService = inject(ViewProgressService)

  tagToolTipString: string = "Tags"
  @ViewChild("bookmark") bookmark: BookmarkIconComponent | undefined

  constructor(private _router: Router) {
  }

  ngOnInit(): void {
    this.tagToolTipString = this.video.tags?.map(tag => tag.name).join(", ")
    console.log(this.video)
  }

  @HostListener('click', ['$event'])
  openVideo(){
    this._router.navigate(['video/' + this.video?.contentId])
  }

  addToBookmarks(event: MouseEvent){
    event.stopPropagation();

    if(this.bookmark?.marked){
      this.updateDashboard.emit({video: this.video, action: "remove"})
    } else{
      this.updateDashboard.emit({video: this.video, action: "add"})
    }

    this.bookmark?.toggleMarked()
    console.log("Added to bookmarks")

    this.userService.toggleSavedContent(this.video.contentId)
  }

  removeSuggestion(event: MouseEvent) {
    event.stopPropagation();

    this.viewProgressService.ignoreViewProgress(this.video.contentId)
    console.log("Removed suggestion")
    this.updateDashboard.emit({video: this.video, action: "remove"})
  }

  protected readonly Utils = Utils
}
