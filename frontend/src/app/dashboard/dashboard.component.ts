import {Component, inject, OnInit} from '@angular/core';
import {NavigationComponent} from "../navigation/navigation.component"
import {VideoComponent} from "../video/video.component"
import {Router} from "@angular/router"
import {VideoOverview, VideoService, ViewProgressModel} from "../service/video.service";

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
export class DashboardComponent implements OnInit {
  service = inject(VideoService);
  videoList: VideoOverview[] | undefined;
  progressList: [number, ViewProgressModel][] | undefined;

  ngOnInit(): void {
    this.service.getVideoList().subscribe(videos => {
      this.videoList = videos;

      this.progressList = [];
      videos.forEach(video => {
        this.service.getVideoProgress(video.videoId, 1).subscribe(progress => {
          this.progressList?.push([video.videoId, progress]);
          console.log(this.progressList);
        }, error => {
          console.log(error);
        });
      });
    });
  }

  getProgressForVideo(videoId: number): ViewProgressModel {
    return this.progressList?.find(([id, _]) => id === videoId)?.[1] as ViewProgressModel;
  }
}
