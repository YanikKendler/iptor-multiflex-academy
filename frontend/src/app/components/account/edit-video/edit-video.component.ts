import {Component, ElementRef, inject, model, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {VideoDetailDTO, VideoService, VisibilityEnum} from "../../../service/video.service";
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TextfieldComponent} from "../../basic/textfield/textfield.component"
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {UploadVideoComponent} from "../upload-video/upload-video.component"
import {ConfirmComponent} from "../../dialogue/confirm/confirm.component"
import {MatButton} from "@angular/material/button"
import {DropdownComponent, DropdownOption} from "../../basic/dropdown/dropdown.component"
import {Utils} from "../../../utils"
import {MatDivider} from "@angular/material/divider"
import {AnswerOption, Question} from "../../../service/question.service"
import {AnswerOptionComponent} from "../answer-option/answer-option.component"
@Component({
  selector: 'app-edit-video',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    TextfieldComponent,
    FaIconComponent,
    UploadVideoComponent,
    MatButton,
    DropdownComponent,
    MatDivider,
    AnswerOptionComponent
  ],
  templateUrl: './edit-video.component.html',
  styleUrl: './edit-video.component.scss'
})
export class EditVideoComponent implements OnInit{
  readonly videoService = inject(VideoService);

  readonly dialogRef = inject(MatDialogRef<EditVideoComponent>);
  readonly data = inject<number>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);

  video: VideoDetailDTO = {} as VideoDetailDTO;
  oldVideo: VideoDetailDTO = {} as VideoDetailDTO; //used for checking for changes

  @ViewChild("color") colorInput!: ElementRef<HTMLInputElement>;

  selectedQuestion: Question = {} as Question;

  ngOnInit(): void {
    this.videoService.getVideoDetails(this.data).subscribe(video => {
      this.video = video;
      this.oldVideo= {...video} //actual deep clone

      this.selectedQuestion = video.questions[0]
      console.log(this.selectedQuestion)
    })

    this.dialogRef.backdropClick().subscribe(() => {
      this.close()
    })

    this.dialogRef.keydownEvents().subscribe(event => {
      if(event.key === "Escape") {
        this.close()
      }
    })
  }

  saveChanges() {
    this.videoService.updateVideo(this.video).subscribe(result => {
      this.video = result;
      this.oldVideo = {...result}
    })
  }

  close(){
    //compare the actual data currently in the video vs the data when the dialog was opened to see if there are any changes
    if(JSON.stringify(this.video) !== JSON.stringify(this.oldVideo)){
      this.confirmClose()
    }
    else {
      this.dialogRef.close();
    }
  }

  confirmClose() {
    this.dialog.open(ConfirmComponent, {
      height: "200px",
      width: "400px",
      data: {
        message: "You have unsaved changes. Are you sure you want to close the editor?"
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if(confirm) {
        this.dialogRef.close();
      }
    })
  }

  videoFileUpdated(fileId:number) {
    if(this.video.contentId)
      this.videoService.linkVideoFile(this.video.contentId, fileId).subscribe(result => {
        console.log("linked videos")
      })
    else {
       this.video.videoFile = {videoFileId: fileId}
    }
  }

  visibilityUpdated(option: DropdownOption){
    this.video.visibility = VisibilityEnum[option.id as keyof typeof VisibilityEnum]
  }

  colorUpdated(){
    this.video.color = this.colorInput.nativeElement.value;
  }

  protected readonly Utils = Utils
  protected readonly faPlus = faPlus
}
