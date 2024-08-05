import {Component, inject, Input, OnInit} from '@angular/core';
import {AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {NavigationComponent} from "../navigation/navigation.component"
import {StarIconComponent} from "../icons/star/star.icon.component"
import {BookmarkIconComponent} from "../icons/bookmark/bookmark.icon.component"
import {VideoService} from "../service/video.service";
import {VideoModel} from "../model/VideoModel";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-view-video',
  standalone: true,
  imports: [
    NavigationComponent,
    StarIconComponent,
    BookmarkIconComponent
  ],
  templateUrl: './view-video.component.html',
  styleUrl: './view-video.component.scss'
})
export class ViewVideoComponent implements AfterViewInit, OnInit{
  service = inject(VideoService)
  video : VideoModel | undefined

  markerPos = {width: 0, left: 0}

  @ViewChild('tabSelector') tabSelector: ElementRef | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        console.log(params)

        this.service.getVideoById(params['id']).subscribe(video => {
          console.log(video)
          this.video = video
        })
      }
    )
  }

  selectTab(tab: "comments" | "quiz"){
    let tabElement: HTMLElement
    if(tab === "comments"){
      tabElement = this.tabSelector?.nativeElement.querySelector('.comments') as HTMLElement
    } else {
      tabElement = this.tabSelector?.nativeElement.querySelector('.quiz') as HTMLElement
    }
    this.markerPos = {width: tabElement.clientWidth, left: tabElement.offsetLeft}
  }

  ngAfterViewInit(): void {
    this.selectTab("comments")
  }
}
