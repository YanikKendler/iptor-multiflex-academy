import {Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TextfieldComponent} from "../../basic/textfield/textfield.component";
import {VideoRequestDTO, VideoService} from "../../../service/video.service";
import {Config} from "../../../config";
import {UserService} from "../../../service/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-request-video',
  standalone: true,
  imports: [
    TextfieldComponent
  ],
  templateUrl: './request-video.component.html',
  styleUrl: './request-video.component.scss'
})
export class RequestVideoComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<RequestVideoComponent>);
  readonly data = inject<number>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);

  snackBar = inject(MatSnackBar)
  videoService = inject(VideoService)
  userService = inject(UserService)
  videoRequest = {title: "", text: "", userId: this.userService.currentUser.value.userId} as VideoRequestDTO

  ngOnInit(): void {
    this.dialogRef.backdropClick().subscribe(() => {
      this.close()
    })

    this.dialogRef.keydownEvents().subscribe(event => {
      if(event.key === "Escape") {
        this.close()
      }
    })
  }

  close(){
    this.dialogRef.close();
  }


  sendRequest(){
    if(this.videoRequest.title != "" && this.videoRequest.text != ""){
      this.videoService.createVideoRequest(this.videoRequest).subscribe(() => {
        this.close()
        this.snackBar.open("Video request has been sent successfully", "", {duration: 2000})
      })
    }
  }

  updateTitle($event: string) {
    this.videoRequest.title = $event
  }

  updateDescription($event: string) {
    this.videoRequest.text = $event
  }
}
