import {Component, inject, OnInit} from '@angular/core';
import {NavigationComponent} from "../navigation/navigation.component"
import {VideoComponent} from "../video/video.component"
import {Router} from "@angular/router"
import {VideoOverview, VideoService, ViewProgress} from "../service/video.service";
import {Utils} from "../utils"

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
  progressList: [number, ViewProgress][] | undefined;

  ngOnInit(): void {
    this.service.getVideoList().subscribe((videos: VideoOverview[]) => {
      this.videoList = videos;

      this.progressList = [];
      videos.forEach(video => {
        this.service.getVideoProgress(video.videoId, 1).subscribe(progress => {
          video.viewProgress = progress;
        }, error => {});
      });
    });

    console.log(Utils.toSmartTimeString(new Date()))
    console.log(Utils.toSmartTimeString(new Date("07.08.2024 20:54")))
    console.log(Utils.toSmartTimeString(new Date(1000*60*80)))
    console.log(Utils.toSmartTimeString(new Date("05.08.2024")))
    console.log(Utils.toSmartTimeString(new Date("07.06.2020")))
  }
}
