import {Component, inject, Input, OnInit} from '@angular/core';
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
export class ViewVideoComponent implements OnInit {
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
}
