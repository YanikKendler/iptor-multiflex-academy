import {Component, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {VideoOverviewDTO, VideoRequestDetailDTO, VideoRequestEnum, VideoService} from "../../../service/video.service";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmComponent} from "../../dialogue/confirm/confirm.component";
import {NgClass, NgIf} from "@angular/common"
import {MatTooltip} from "@angular/material/tooltip"

@Component({
  selector: 'app-video-request-field',
  standalone: true,
  imports: [
    CdkMenuTrigger,
    MatButton,
    CdkMenu,
    NgIf,
    NgClass,
    MatTooltip
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

  @ViewChild(CdkMenuTrigger) trigger!: CdkMenuTrigger

  constructor() {

  }

  confirmClose(videoRequest: VideoRequestDetailDTO, status: VideoRequestEnum) {
    this.dialog.open(ConfirmComponent, {
      width: "400px",
      data: {
        message: `Do you want to ${status == VideoRequestEnum.finished ? "finish" : "decline"} the video request ""${videoRequest.title}"?`
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if(confirm) {
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
    this.trigger.open()

    setTimeout(() => {
        this.generateContentOptions("")
    },)
  }
}
