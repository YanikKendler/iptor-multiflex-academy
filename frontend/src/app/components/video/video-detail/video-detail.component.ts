// In `src/app/components/video/video-detail/video-detail.component.ts`
import {AfterViewChecked, AfterViewInit, Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {NavigationComponent} from "../../navigation/navigation.component"
import {StarIconComponent} from "../../icons/star/star.icon.component"
import {BookmarkIconComponent} from "../../icons/bookmark/bookmark.icon.component"
import {ActivatedRoute, Params, Router} from "@angular/router";
import {VideoQuizComponent} from "../video-quiz/video-quiz.component";
import {VideoDetailDTO, VideoService} from "../../../service/video.service"
import {MediaPlayerComponent} from "../media-player/media-player.component"
import {VideoRatingComponent} from "../video-rating/video-rating.component";
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {UserService} from "../../../service/user.service";
import {VideoCommentContainerComponent} from "../video-comment-container/video-comment-container.component"
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faShare} from "@fortawesome/free-solid-svg-icons";
import {Config} from "../../../config";
import {NgIf} from "@angular/common";

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
    NgIf
  ],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.scss'
})
export class VideoDetailComponent implements AfterViewInit, OnInit{
  service = inject(VideoService)
  video : VideoDetailDTO = {} as VideoDetailDTO

  userService = inject(UserService)

  markerPos = {width: 0, left: 0}
  @ViewChild("bookmark") bookmark: BookmarkIconComponent | undefined
  @ViewChild('tabSelector') tabSelector: ElementRef | undefined;
  currentTab : "comments" | "quiz" = "comments"
  showPopup: boolean = false; // Add this property

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.service.getVideoDetails(params['id']).subscribe(video => {
          console.log(video)
          this.video = video

          this.userService.isVideoSaved(this.video.contentId).subscribe(isSaved => {
            if(isSaved){
              this.bookmark?.toggleMarked()
            }
          })
        })
      }
    )
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

  ngAfterViewInit(): void {
    this.selectTab("comments")
  }

  addToBookmarks(event: MouseEvent){
    event.stopPropagation();
    this.bookmark?.toggleMarked()
    console.log("Added to bookmarks")

    // todo user not hard coded
    this.userService.toggleSavedVideo(this.video.contentId)
  }

  shareVideo() {
    const url = Config.API_URL + "/video/" + this.video.contentId;
    navigator.clipboard.writeText(url).then(() => {
      console.log("URL copied to clipboard");
      this.showPopup = true; // Show the popup
      setTimeout(() => {
        this.showPopup = false; // Hide the popup after 3 seconds
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy URL: ", err);
    });
  }

  protected readonly faShare = faShare;
}
