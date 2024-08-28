import {AfterViewChecked, AfterViewInit, Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {NavigationComponent} from "../../base/navigation/navigation.component"
import {StarIconComponent} from "../../icons/star/star.icon.component"
import {BookmarkIconComponent} from "../../icons/bookmark/bookmark.icon.component"
import {ActivatedRoute, Params, Router} from "@angular/router";
import {VideoQuizComponent} from "../video-quiz/video-quiz.component";
import {VideoDetailDTO, VideoService} from "../../../service/video.service"
import {MediaPlayerComponent} from "../../basic/media-player/media-player.component"
import {VideoRatingComponent} from "../video-rating/video-rating.component";
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {UserService} from "../../../service/user.service";
import {VideoCommentContainerComponent} from "../video-comment-container/video-comment-container.component"
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCheckCircle, faPen, faShare} from "@fortawesome/free-solid-svg-icons";
import {Config} from "../../../config";
import {NgClass, NgIf} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar"
import {MatTooltip} from "@angular/material/tooltip"
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-video-detail',
  standalone: true,
  imports: [
    NavigationComponent,
    StarIconComponent,
    BookmarkIconComponent,
    VideoQuizComponent,
    MediaPlayerComponent,
    VideoRatingComponent,
    IconButtonComponent,
    VideoCommentContainerComponent,
    FaIconComponent,
    NgIf,
    MatTooltip,
    MatButton,
    NgClass
  ],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.scss'
})
export class VideoDetailComponent implements AfterViewInit, OnInit{
  service = inject(VideoService)
  video : VideoDetailDTO = {} as VideoDetailDTO
  snackBar = inject(MatSnackBar);

  userService = inject(UserService)

  markerPos = {width: 0, left: 0}
  @ViewChild("bookmark") bookmark: BookmarkIconComponent | undefined
  @ViewChild('tabSelector') tabSelector: ElementRef | undefined;
  currentTab : "comments" | "quiz" = "comments"

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      if (user.userId <= 0) return

      this.route.params.subscribe(
        (params: Params) => {
          this.service.getVideoDetails(params['id']).subscribe(video => {
            console.log(video)
            this.video = video

            this.userService.isVideoSaved(this.video.contentId).subscribe(isSaved => {
              if (isSaved) {
                this.bookmark?.toggleMarked()
              }
            })
          })
        }
      )
    })
  }

  ngAfterViewInit(): void {
    this.selectTab("comments")
  }

  selectTab(tab: "comments" | "quiz"){
    this.currentTab = tab
    let tabElement: HTMLElement

    if(tab === "comments"){
      tabElement = this.tabSelector?.nativeElement.querySelector('.comments') as HTMLElement
    } else {
      tabElement = this.tabSelector?.nativeElement.querySelector('.quiz') as HTMLElement
    }

    let marker = this.tabSelector?.nativeElement.querySelector('.marker') as HTMLElement
    marker.style.width = tabElement.clientWidth - 16 + "px"
    marker.style.left = tabElement.offsetLeft + 8 + "px"

    this.markerPos = {width: tabElement.clientWidth, left: tabElement.offsetLeft}
  }

  addToBookmarks(event: MouseEvent){
    event.stopPropagation();
    this.bookmark?.toggleMarked()
    console.log("Added to bookmarks")

    this.userService.toggleSavedContent(this.video.contentId)
  }

  shareVideo() {
    const url = Config.API_URL + "/video/" + this.video.contentId;
    navigator.clipboard.writeText(url).then(() => {
      this.snackBar.open("URL copied to clipboard", "", {duration: 2000})
    })
  }

  generateDescriptionWithLinebreaks(){
    if(!this.video.description) return ""
    return this.video.description.replace(/\n/g, "<br>")
  }

  protected readonly faShare = faShare;

  finishVideo() {
    this.userService.finishAssignedContent(this.video.contentId).subscribe()
  }

  approveVideo() {
    this.userService.approveContent(this.video.contentId).subscribe(response => {
      this.video.approved = true
    })
  }

  protected readonly Config = Config
  protected readonly faCheckCircle = faCheckCircle
  protected readonly faPen = faPen
}
