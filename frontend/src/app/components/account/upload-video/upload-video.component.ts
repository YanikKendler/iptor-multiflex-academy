import {Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {faArrowUpFromBracket} from "@fortawesome/free-solid-svg-icons"
import {FaIconComponent} from "@fortawesome/angular-fontawesome"
import {VideoFile, VideoService} from "../../../service/video.service"
import {MatProgressSpinner} from "@angular/material/progress-spinner"
import {MatButton} from "@angular/material/button"
import {MatDialog} from "@angular/material/dialog"
import {ConfirmComponent} from "../../dialogue/confirm/confirm.component"
import {Utils} from "../../../utils"
import {MatProgressBar} from "@angular/material/progress-bar";
import {Config} from "../../../config";
import {MatSnackBar} from "@angular/material/snack-bar"
import {NgClass} from "@angular/common"
import {DotLoaderComponent} from "../../basic/dot-loader/dot-loader.component"

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports: [
    FaIconComponent,
    MatProgressSpinner,
    MatButton,
    MatProgressBar,
    NgClass,
    DotLoaderComponent,
  ],
  templateUrl: './upload-video.component.html',
  styleUrl: './upload-video.component.scss'
})
export class UploadVideoComponent {
  @Input() videoFile: VideoFile = {} as VideoFile
  @Output() uploadStatus = new EventEmitter<VideoFile>()

  readonly videoService = inject(VideoService)
  readonly dialog = inject(MatDialog)

  readonly snackbar = inject(MatSnackBar)

  uploadProgress: number = 0;

  draggingFile: boolean = false;

  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;

  dragOverHandler(ev: DragEvent) {
    ev.preventDefault();

    this.draggingFile = true
  }

  dragLeaveHandler(ev: DragEvent) {
    ev.preventDefault()

    this.draggingFile = false
  }

  dropHandler(ev: DragEvent) {
    ev.preventDefault();
    this.draggingFile = false

    if(!ev.dataTransfer) {
      this.showUploadError("An unknown error occurred while uploading the file")
      return
    }

    if ( ev.dataTransfer.items) {
      if(ev.dataTransfer.items.length > 1) {
        this.showUploadError("Only one file can be uploaded at a time")
        return
      }

      let item = ev.dataTransfer.items[0]

      if (item.kind === "file") {
        this.uploadFile(item.getAsFile())
      }
    } else {
      if(ev.dataTransfer.files.length > 1) {
        this.showUploadError("Only one file can be uploaded at a time")
        return
      }

      this.uploadFile(ev.dataTransfer.files[0])
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadFile(event.target.files[0])
    }
  }

  uploadFile(file: File | null) {
    const VALID_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/mov"]
    const MAX_SIZE_MB = 1000;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if(file == null) {
      this.showUploadError("Please upload a valid video file")
      return
    }

    if(file.size > MAX_SIZE_BYTES) {
      this.showUploadError("The uploaded video is too large, please upload a video smaller than 1GB")
      return
    }

    if(!VALID_TYPES.includes(file.type)) {
      this.showUploadError(`The uploaded filetype is not supported, please upload one of the following: ${VALID_TYPES.join(", ")}`)
      return
    }

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${Config.API_URL}/video/videofile?filename=${file.name}`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        this.uploadProgress = Math.round((100 * event.loaded) / event.total);
      }
    };

    this.videoFile.videoFileId = 0;
    this.uploadStatus.emit(this.videoFile);

    xhr.onload = () => {
      if (xhr.status === 200) {
        this.videoFile = JSON.parse(xhr.responseText);
        this.uploadStatus.emit(this.videoFile);
        this.uploadProgress = 0;
      } else {
        this.showUploadError(xhr.response, true)
      }
    };

    xhr.onerror = () => {
      this.showUploadError(xhr.statusText, true)
    };

    xhr.send(formData);
  }

  showUploadError(text: string, severe: boolean = false) {
    console.error(`file upload ERROR: ${text}`)
    this.snackbar.open(
      `Video upload Failed - please ${severe ? 'contact an administrator' : 'try again'} - ERROR: ${text}`,
      "dismiss",
      {panelClass: 'error', duration: severe ? 10000000 : 5000}
    )

    //reset inputs and uploads to accept a new file
    this.videoFile.videoFileId = -1
    this.uploadStatus.emit(this.videoFile);
    this.uploadProgress = 0
    this.fileInput.nativeElement.value = ""
  }

  confirmReplacement(continuationFunction: () => void){
    if(this.videoFile.videoFileId < 0) return

    let dialogRef = this.dialog.open(ConfirmComponent, {
      height: "200px",
      width: "400px",
      data: {
        message: "The old video will be deleted and replaced, this action cannot be undone. Are you sure you want to continue?"
      }
    });

    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if(!confirm) return

      this.deleteVideo()

      continuationFunction()
    },
    ()=>{
      this.snackbar.open("Failed to delete the old video", "Dismiss", {duration: 5000})
    })
  }

  confirmDropReplacement(e:any){
    this.confirmReplacement(() => {this.dropHandler(e)})
  }

  confirmClickReplacement(){
    this.confirmReplacement(() => {this.fileInput.nativeElement.click()})
  }

  deleteVideo(){
    this.videoService.deleteVideoFile(this.videoFile.videoFileId).subscribe(response => {
      this.videoFile.videoFileId = -1
      this.uploadStatus.emit(this.videoFile)
    })
  }

  protected readonly faArrowUpFromBracket = faArrowUpFromBracket
  protected readonly Utils = Utils
}
