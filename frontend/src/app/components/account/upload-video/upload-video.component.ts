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

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports: [
    FaIconComponent,
    MatProgressSpinner,
    MatButton,
  ],
  templateUrl: './upload-video.component.html',
  styleUrl: './upload-video.component.scss'
})
export class UploadVideoComponent {
  @Input() videoFile: VideoFile = {} as VideoFile
  @Output() uploadFinished = new EventEmitter<number>()

  readonly videoService = inject(VideoService);
  readonly dialog = inject(MatDialog);

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

  uploadFile(file: File){
    this.videoFile.videoFileId = 0
    this.videoService.uploadVideoFile(file).subscribe(result => {
      console.log('File uploaded successfully:', result);
      this.videoFile = result
      this.uploadFinished.emit(this.videoFile.videoFileId)
    });
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
    });
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
