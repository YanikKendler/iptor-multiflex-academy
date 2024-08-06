import {AfterViewChecked, AfterViewInit, Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {NavigationComponent} from "../navigation/navigation.component"
import {StarIconComponent} from "../icons/star/star.icon.component"
import {BookmarkIconComponent} from "../icons/bookmark/bookmark.icon.component"
import {VideoModel, VideoService} from "../service/video.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {VideoCommentsComponent} from "../video-comments/video-comments.component";
import {VideoQuizComponent} from "../video-quiz/video-quiz.component";

@Component({
  selector: 'app-view-video',
  standalone: true,
  imports: [
    NavigationComponent,
    StarIconComponent,
    BookmarkIconComponent,
    VideoCommentsComponent,
    VideoQuizComponent
  ],
  templateUrl: './view-video.component.html',
  styleUrl: './view-video.component.scss'
})
export class ViewVideoComponent implements AfterViewInit, OnInit{
  service = inject(VideoService)
  video : VideoModel | undefined

  markerPos = {width: 0, left: 0}

  @ViewChild('tabSelector') tabSelector: ElementRef | undefined;
  currentTab : "comments" | "quiz" = "comments"

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.service.getVideoById(params['id']).subscribe(video => {
          console.log(video)
          this.video = video
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
    marker.style.width = tabElement.clientWidth + "px"
    marker.style.left = tabElement.offsetLeft + "px"
    this.markerPos = {width: tabElement.clientWidth, left: tabElement.offsetLeft}
  }

  ngAfterViewInit(): void {
    this.selectTab("comments")
  }
}
