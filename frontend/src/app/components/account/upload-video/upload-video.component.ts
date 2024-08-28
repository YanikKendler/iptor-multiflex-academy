import {Component, ElementRef, EventEmitter, inject, Inject, Input, Output, ViewChild} from '@angular/core';
import {faArrowUpFromBracket} from "@fortawesome/free-solid-svg-icons"
import {FaIconComponent} from "@fortawesome/angular-fontawesome"
import {VideoFile, VideoService} from "../../../service/video.service"
import {MatProgressSpinner} from "@angular/material/progress-spinner"
import {MatButton} from "@angular/material/button"
import {EditVideoComponent} from "../edit-video/edit-video.component"
import {MatDialog} from "@angular/material/dialog"
import {ConfirmComponent} from "../../dialogue/confirm/confirm.component"
import {Utils} from "../../../utils"
import {MatProgressBar} from "@angular/material/progress-bar";
import {Config} from "../../../config";
import {MatSnackBar} from "@angular/material/snack-bar"

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports: [
    FaIconComponent,
    MatProgressSpinner,
    MatButton,
    MatProgressBar,
  ],
  templateUrl: './upload-video.component.html',
  styleUrl: './upload-video.component.scss'
})
export class UploadVideoComponent {
  @Input() videoFile: VideoFile = {} as VideoFile
  @Output() uploadFinished = new EventEmitter<VideoFile>()

  readonly videoService = inject(VideoService)
  readonly dialog = inject(MatDialog)

  readonly snackbar = inject(MatSnackBar)

  uploadProgress: number = 0;

  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;

  //code stolen from mdn
  dragOverHandler(ev: DragEvent) {
    console.log("File(s) in drop zone");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  dropHandler(ev: DragEvent) {
    console.log("File(s) dropped");
    ev.preventDefault();

    if (ev.dataTransfer && ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      // @ts-ignore sry
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          this.uploadFile(item.getAsFile())
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      // @ts-ignore
      [...ev.dataTransfer.files].forEach((file, i) => {
        this.uploadFile(file)
      });
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadFile(event.target.files[0])
    }
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${Config.API_URL}/video/videofile?filename=${file.name}`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        this.uploadProgress = Math.round((100 * event.loaded) / event.total);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        this.videoFile = result;
        this.uploadFinished.emit(this.videoFile);
        this.uploadProgress = 0;
      } else {
        this.fileUploadError(xhr.response)
      }
    };

    xhr.onerror = () => {
      this.fileUploadError(xhr.statusText)
    };

    this.videoFile.videoFileId = 0;
    xhr.send(formData);
  }

  fileUploadError(text: string){
    console.error(`Video upload Failed - please try again or contact an administrator - ERROR: ${text}`)
    this.snackbar.open(`Video upload Failed - please try again or contact an administrator - ERROR: ${text}`, "dismiss", {panelClass: 'error'} )
    this.videoFile.videoFileId = -1
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
    })
  }

  protected readonly faArrowUpFromBracket = faArrowUpFromBracket
  protected readonly Utils = Utils
}
