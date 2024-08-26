import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {VideoOverviewDTO, VideoRequestDetailDTO, VideoRequestEnum, VideoService} from "../../../service/video.service";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmComponent} from "../../dialogue/confirm/confirm.component";

@Component({
  selector: 'app-video-request-field',
  standalone: true,
  imports: [
    CdkMenuTrigger,
    MatButton,
    CdkMenu
  ],
  templateUrl: './video-request-field.component.html',
  styleUrl: './video-request-field.component.scss'
})
export class VideoRequestFieldComponent {
  videoService = inject(VideoService)
  readonly dialog = inject(MatDialog);

  @Input() videoRequest : VideoRequestDetailDTO = {} as VideoRequestDetailDTO
  @Input() allVideos: VideoOverviewDTO[] = []
  @Output() isDone : EventEmitter<null> = new EventEmitter<null>()
  videoOptions: VideoOverviewDTO[] = []
  selectedVideo = {} as VideoOverviewDTO

  constructor() {

  }

  confirmClose(videoRequest: VideoRequestDetailDTO, status: VideoRequestEnum) {
    this.dialog.open(ConfirmComponent, {
      height: "200px",
      width: "400px",
      data: {
        message: `Do you want to ${status == VideoRequestEnum.finished ? "finish" : "decline"} this video request?`
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if(confirm) {
        console.log("closing")
        this.setStatus(videoRequest, status)
      }
    })
  }

  generateContentOptions(input: string) {
    this.videoOptions = this.allVideos.filter(video => video.contentId != this.selectedVideo.contentId)
    this.videoOptions = this.videoOptions.filter(video => video.title.toLowerCase().includes(input.toLowerCase()))
  }

  setVideo(video: VideoOverviewDTO) {
    this.videoRequest.videoId = video.contentId
    this.selectedVideo = video
  }

  setStatus(videoRequest: VideoRequestDetailDTO, status: VideoRequestEnum) {
    this.videoService.setVideoRequestStatus(videoRequest.requestId, status, videoRequest.videoId)
    this.isDone.emit()
  }

  protected readonly VideoRequestEnum = VideoRequestEnum;

  resetSelection() {
    this.selectedVideo = {} as VideoOverviewDTO
  }
}
