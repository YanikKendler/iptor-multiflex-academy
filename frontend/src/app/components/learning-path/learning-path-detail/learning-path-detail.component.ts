import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {LearningPathDetailDTO, LearningPathEntryDTO, LearningPathService} from "../../../service/learning-path.service";
import {ActivatedRoute, Params} from "@angular/router";
import {MediaPlayerComponent} from "../../basic/media-player/media-player.component";
import {VideoDetailDTO, VideoService} from "../../../service/video.service";
import { faShare} from "@fortawesome/free-solid-svg-icons";
import {faCircle, faCircleCheck, } from "@fortawesome/free-regular-svg-icons";
import {BookmarkIconComponent} from "../../icons/bookmark/bookmark.icon.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {VideoRatingComponent} from "../../video/video-rating/video-rating.component";
import {VideoCommentContainerComponent} from "../../video/video-comment-container/video-comment-container.component";
import {VideoQuizComponent} from "../../video/video-quiz/video-quiz.component";
import {NavigationComponent} from "../../navigation/navigation.component";
import {NgClass, NgStyle} from "@angular/common";

@Component({
  selector: 'app-learning-path-detail',
  standalone: true,
  imports: [
    MediaPlayerComponent,
    BookmarkIconComponent,
    FaIconComponent,
    IconButtonComponent,
    VideoRatingComponent,
    VideoCommentContainerComponent,
    VideoQuizComponent,
    NavigationComponent,
    NgClass,
    NgStyle
  ],
  templateUrl: './learning-path-detail.component.html',
  styleUrl: './learning-path-detail.component.scss'
})
export class LearningPathDetailComponent implements OnInit, AfterViewInit{
  @ViewChild('tabSelector') tabSelector: ElementRef | undefined;
  currentTab : "description" | "comments" = "description"
  markerPos = {width: 0, left: 0}

  videoProgress: number[] = []

  service = inject(LearningPathService)
  learningPath : LearningPathDetailDTO = {} as LearningPathDetailDTO

  currentVideo : VideoDetailDTO = {} as VideoDetailDTO
  progressPercent : number = 0

  videoService = inject(VideoService)

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.service.getLearningPathDetails(params['id']).subscribe(learningPath => {
          console.log(learningPath)
          this.learningPath = learningPath

          if(this.learningPath.viewProgress){
            this.progressPercent = this.learningPath.viewProgress.progress / this.learningPath.entries.length * 100
          }

          for (let i = 1; i <= this.learningPath.entries.length; i++) {
            this.videoProgress.push(i)
          }

          this.getVideoDetails(this.learningPath.entries[this.learningPath.viewProgress.progress-1].videoId)
        })
      }
    )

  }

  getVideoDetails(videoId: number){
    this.videoService.getVideoDetails(videoId).subscribe(video => {
      this.currentVideo = video
    })
  }

  getProgressBarColor(number: number): string {
    if(this.learningPath.viewProgress && number <= this.learningPath.viewProgress.progress){
      return this.learningPath.color
    } else{
      return "hsl(0, 0%, 69%)"
    }
  }

  selectTab(tab: "description" | "comments"){
    this.currentTab = tab
    let tabElement: HTMLElement

    if(tab === "comments"){
      tabElement = this.tabSelector?.nativeElement.querySelector('.comments') as HTMLElement
    } else {
      tabElement = this.tabSelector?.nativeElement.querySelector('.description') as HTMLElement
    }

    let marker = this.tabSelector?.nativeElement.querySelector('.marker') as HTMLElement
    marker.style.width = tabElement.clientWidth - 16 + "px"
    marker.style.left = tabElement.offsetLeft + 8 + "px"

    this.markerPos = {width: tabElement.clientWidth, left: tabElement.offsetLeft}
  }

  ngAfterViewInit(): void {
    this.selectTab("description")
  }

  generateDescriptionWithLinebreaks(){
    if(!this.currentVideo.description) return ""
    return this.currentVideo.description.replace(/\n/g, "<br>")
  }

  protected readonly faShare = faShare;
  protected readonly faCircleCheck = faCircleCheck;
  protected readonly faCircle = faCircle;
}
