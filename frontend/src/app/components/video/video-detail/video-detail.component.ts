import {AfterViewChecked, AfterViewInit, Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {NavigationComponent} from "../../navigation/navigation.component"
import {StarIconComponent} from "../../icons/star/star.icon.component"
import {BookmarkIconComponent} from "../../icons/bookmark/bookmark.icon.component"
import {ActivatedRoute, Params, Router} from "@angular/router";
import {VideoCommentsComponent} from "../video-comments/video-comments.component";
import {VideoQuizComponent} from "../video-quiz/video-quiz.component";
import {VideoDetailDTO, VideoService} from "../../../service/video.service"
import {MediaPlayerComponent} from "../media-player/media-player.component"

@Component({
  selector: 'app-video-detail',
  standalone: true,
    imports: [
        NavigationComponent,
        StarIconComponent,
        BookmarkIconComponent,
        VideoCommentsComponent,
        VideoQuizComponent,
        MediaPlayerComponent
    ],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.scss'
})
export class VideoDetailComponent implements AfterViewInit, OnInit{
  service = inject(VideoService)
  video : VideoDetailDTO | undefined

  markerPos = {width: 0, left: 0}

  @ViewChild('tabSelector') tabSelector: ElementRef | undefined;
  currentTab : "comments" | "quiz" = "comments"

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.service.getVideoDetails(params['id'], 1).subscribe(video => {
          this.video = video
          console.log(video)
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
}
