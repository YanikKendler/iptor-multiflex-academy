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
  title: string = 'Video Title';
  description: string = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt iste iusto laudantium tempora! Debitis iure, quo. Accusamus ad adipisci alias amet assumenda, commodi consequuntur dolore est ex excepturi fugit impedit ipsa ipsum iste itaque labore laudantium minus molestias natus nesciunt nihil nostrum officiis pariatur quam quibusdam reprehenderit saepe sed temporibus ullam ut. Accusamus beatae deleniti dignissimos doloremque dolores dolorum ea, et eveniet exercitationem expedita, explicabo id impedit libero magni maiores modi nam natus nulla obcaecati optio, placeat quaerat quisquam quo vero voluptate voluptates voluptatum? Ab itaque quia unde? A alias autem dolore ducimus tenetur. Amet distinctio exercitationem quaerat rem ullam!';

  markerPos = {width: 0, left: 0}

  @ViewChild('tabSelector') tabSelector: ElementRef | undefined;

  service = inject(VideoService)

  viewVideo : VideoModel | undefined

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        console.log(params)

        this.service.getVideoById(params['id']).subscribe(video => {
          console.log(video)
          this.viewVideo = video
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
