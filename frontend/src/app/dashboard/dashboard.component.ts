import {Component, inject, OnInit} from '@angular/core';
import {NavigationComponent} from "../navigation/navigation.component"
import {VideoComponent} from "../video/video.component"
import {Router} from "@angular/router"
import {VideoService} from "../service/video.service";
import {VideoModel} from "../model/VideoModel";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NavigationComponent,
    VideoComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  service = inject(VideoService)
  videoList : VideoModel[] | undefined

  ngOnInit(): void {
    this.service.getVideoList().subscribe(videos => {
      this.videoList = videos
    })
  }
}
