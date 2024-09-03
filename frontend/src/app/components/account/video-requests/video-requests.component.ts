import {Component, inject, OnInit} from '@angular/core';
import {
  ContentOverviewDTO,
  VideoOverviewDTO,
  VideoRequestDetailDTO, VideoRequestDTO, VideoRequestEnum,
  VideoService
} from "../../../service/video.service";
import {MatButton} from "@angular/material/button";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {UserAssignedContentDTO} from "../../../service/user.service";
import {MatDialog} from "@angular/material/dialog";
import {VideoRequestFieldComponent} from "../video-request-field/video-request-field.component";

@Component({
  selector: 'app-video-requests',
  standalone: true,
  imports: [
    MatButton,
    CdkMenu,
    CdkMenuTrigger,
    VideoRequestFieldComponent
  ],
  templateUrl: './video-requests.component.html',
  styleUrl: './video-requests.component.scss'
})
export class VideoRequestsComponent implements OnInit{
  videoRequests : VideoRequestDetailDTO[] = []
  videoService = inject(VideoService)

  allVideos: VideoOverviewDTO[] = []
  videoOptions: VideoOverviewDTO[] = []
  selectedVideo = {} as VideoOverviewDTO

  ngOnInit(): void {
    this.videoService.getVideoRequests().subscribe((videoRequests) => {
      this.videoRequests = videoRequests
    })

    this.videoService.getAll().subscribe(content => {
      this.allVideos = content
      this.generateContentOptions('')
    })
  }

  generateContentOptions(input: string) {
    this.videoOptions = this.allVideos.filter(video => video.contentId != this.selectedVideo.contentId)
    this.videoOptions = this.videoOptions.filter(video => video.title.toLowerCase().includes(input.toLowerCase()))
  }

  updateVideoRequests(videoRequest: VideoRequestDetailDTO) {
    this.videoRequests = this.videoRequests.filter(request => request.requestId != videoRequest.requestId)
  }
}
