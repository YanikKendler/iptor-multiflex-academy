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
import {MatChip} from "@angular/material/chips"
import {Router} from "@angular/router"
import {MatTooltip} from "@angular/material/tooltip"
import {UserService} from "../../service/user.service";
import {ViewProgressService} from "../../service/view-progress.service";
import {BookmarkIconComponent} from "../../components/icons/bookmark/bookmark.icon.component";
import {LearningPathOverviewDTO} from "../../service/learning-path.service";
import {IconButtonComponent} from "../../components/basic/icon-button/icon-button.component";
import {RemoveIconComponent} from "../../components/icons/remove-icon/remove-icon.component";
import {Utils} from "../../utils";
import {ChipComponent} from "../../components/basic/chip/chip.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import {PlayIconComponent} from "../../components/icons/playicon/play.icon.component";
import {LearningPathIconComponent} from "../../components/icons/learning-path-icon/learning-path-icon.component";

export interface UpdateLearningPathDashboardEvent {
  learningPath: LearningPathOverviewDTO;
  action: "add" | "remove";
}

@Component({
  selector: 'app-learning-path-overview',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatChip,
    MatTooltip,
    IconButtonComponent,
    RemoveIconComponent,
    BookmarkIconComponent,
    ChipComponent,
    FaIconComponent,
    PlayIconComponent,
    LearningPathIconComponent
  ],
  templateUrl: './learning-path-overview.component.html',
  styleUrl: './learning-path-overview.component.scss',
})
export class LearningPathOverviewComponent implements OnInit{
  @Input() learningPath: LearningPathOverviewDTO = {} as LearningPathOverviewDTO
  @Input() removable: boolean = false
  @Output() updateDashboard: EventEmitter<UpdateLearningPathDashboardEvent> = new EventEmitter<UpdateLearningPathDashboardEvent>();

  userService = inject(UserService)
  viewProgressService = inject(ViewProgressService)

  tagToolTipString: string = "Tags"
  @ViewChild("bookmark") bookmark: BookmarkIconComponent | undefined

  constructor(private _router: Router) {
  }

  ngOnInit(): void {
    this.tagToolTipString = this.learningPath.tags?.map(tag => tag.name).join(", ")
    console.log(this.learningPath)
  }

  @HostListener('click', ['$event'])
  openVideo(){
    this._router.navigate(['video/' + this.learningPath?.contentId])
  }

  addToBookmarks(event: MouseEvent){
    event.stopPropagation();

    if(this.bookmark?.marked){
      this.updateDashboard.emit({learningPath: this.learningPath, action: "remove"})
    } else{
      this.updateDashboard.emit({learningPath: this.learningPath, action: "add"})
    }

    this.bookmark?.toggleMarked()
    console.log("Added to bookmarks")

    this.userService.toggleSavedContent(this.learningPath.contentId)
  }

  removeSuggestion(event: MouseEvent) {
    event.stopPropagation();

    this.viewProgressService.ignoreViewProgress(this.learningPath.contentId)
    console.log("Removed suggestion")
    this.updateDashboard.emit({learningPath: this.learningPath, action: "remove"})
  }

  protected readonly Utils = Utils;
  protected readonly faPlay = faPlay;
}
