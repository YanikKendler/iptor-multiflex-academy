import {Component, ElementRef, inject, model, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {
  AnswerOption,
  Question,
  VideoDetailDTO,
  VideoFile,
  VideoService,
  VisibilityEnum
} from "../../../service/video.service";
import {NgClass, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TextfieldComponent} from "../../basic/textfield/textfield.component"
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {UploadVideoComponent} from "../upload-video/upload-video.component"
import {ConfirmComponent} from "../../dialogue/confirm/confirm.component"
import {MatButton} from "@angular/material/button"
import {DropdownComponent, DropdownOption} from "../../basic/dropdown/dropdown.component"
import {Utils} from "../../../utils"
import {MatDivider} from "@angular/material/divider"
import {AnswerOptionComponent} from "../answer-option/answer-option.component"
import {Tag, TagService} from "../../../service/tag.service"
import {ChipComponent} from "../../basic/chip/chip.component"
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu"
import {MatMenuTrigger} from "@angular/material/menu"
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component"
import {MatTooltip} from "@angular/material/tooltip"
import {TagSelectorComponent} from "../../basic/tag-selector/tag-selector.component"
import {Config} from "../../../config";
import {UserService} from "../../../service/user.service"
import {MatSnackBar} from "@angular/material/snack-bar"
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
    AnswerOptionComponent,
    NgClass,
    ChipComponent,
    CdkMenu,
    CdkMenuTrigger,
    IconButtonComponent,
    MatTooltip,
    TagSelectorComponent
  ],
  templateUrl: './edit-video.component.html',
  styleUrl: './edit-video.component.scss'
})
export class EditVideoComponent implements OnInit{
  readonly videoService = inject(VideoService);
  readonly userService = inject(UserService)
  readonly snackBar = inject(MatSnackBar)

  readonly dialogRef = inject(MatDialogRef<EditVideoComponent>);
  readonly data = inject<number>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);

  video: VideoDetailDTO = {} as VideoDetailDTO;
  oldVideo: VideoDetailDTO = {} as VideoDetailDTO; //used for checking for changes

  selectedQuestion: Question | undefined;

  ngOnInit(): void {
    console.log(this.data)
    if(this.data > 0){ //editing existing video
      this.videoService.getVideoDetails(this.data).subscribe(video => {
        this.video = video;
        this.oldVideo= JSON.parse(JSON.stringify(this.video)) //actual nested deep copy

        this.selectedQuestion = video.questions![0]
      })
    }
    else{ //creating new video
      this.video = {
        contentId: -1,
        title: "",
        description: "",
        visibility: VisibilityEnum.self,
        color: Utils.generateRandomColor(),
        tags: [],
        questions: [],
        rating: 0,
        userId: this.userService.currentUser.value.userId
      } as VideoDetailDTO
      this.oldVideo= JSON.parse(JSON.stringify(this.video)) //actual nested deep copy
    }

    this.dialogRef.backdropClick().subscribe(() => {
      this.close()
    })

    this.dialogRef.keydownEvents().subscribe(event => {
      if(event.key === "Escape") {
        this.close()
      }
    })

    window.addEventListener("beforeunload", this.beforeUnloadHandler);
  }

  beforeUnloadHandler = (event: Event) => {

    if(JSON.stringify(this.video) !== JSON.stringify(this.oldVideo)){
      // Recommended
      event.preventDefault();

      // Included for legacy support, e.g. Chrome/Edge < 119
      event.returnValue = true;
    }
  };

  saveChanges() {
    if(this.video.contentId > 0) { //saving changes to existing video
      this.videoService.updateVideo(this.video).subscribe(result => {
        this.dialogRef.close();
        window.removeEventListener("beforeunload", this.beforeUnloadHandler);
        this.snackBar.open("Changes to video were saved", "", {duration: 2000})
        //code for saving and keeping the popup open and same question selected
        /*let selectedQuestionPos = this.video.questions.indexOf(this.selectedQuestion)
        this.video = result;
        this.oldVideo = JSON.parse(JSON.stringify(this.video))
        this.selectedQuestion = this.video.questions[selectedQuestionPos] || this.video.questions[0]*/
      }, error => {
        this.snackBar.open("Sorry, your changes could not be saved. Please copy them to another place and try again later.", "", {duration: 5000})
      })
    }
    else { //creating new video
      this.videoService.createVideo(this.video).subscribe(result => {
        console.log(result)
        this.dialogRef.close();
        window.removeEventListener("beforeunload", this.beforeUnloadHandler);
      })
    }
  }

  close(){
    console.log(this.video, this.oldVideo)
    //compare the actual data currently in the video vs the data when the dialog was opened to see if there are any changes
    if(JSON.stringify(this.video) !== JSON.stringify(this.oldVideo)){
      this.confirmClose()
    }
    else {
      window.removeEventListener("beforeunload", this.beforeUnloadHandler);
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
        window.removeEventListener("beforeunload", this.beforeUnloadHandler);
        this.dialogRef.close();
      }
    })
  }

  addQuestion() {
    if(!this.video.questions) return

    this.video.questions.push({questionId: this.video.questions.length * -1 ,text: "", answerOptions: new Array<AnswerOption>()} as Question)
    this.selectedQuestion = this.video.questions[this.video.questions.length - 1]
    this.addAnswerOption()
  }

  removeQuestion() {
    if(!this.selectedQuestion) return

    this.video.questions = this.video.questions!.filter(question => question.questionId !== this.selectedQuestion!.questionId)
    this.selectedQuestion = this.video.questions[0]
  }

  addAnswerOption() {
    if(!this.selectedQuestion) return

    if(!this.selectedQuestion!.answerOptions) this.selectedQuestion!.answerOptions = []

    this.selectedQuestion.answerOptions?.push({text: "", answerOptionId: this.selectedQuestion.answerOptions.length * -1} as AnswerOption)
  }

  //region UPDATE functions

  videoFileUpdated(videoFile: VideoFile) {
    if(this.video.contentId > 0)
      this.videoService.linkVideoFile(this.video.contentId, videoFile.videoFileId).subscribe(result => {
        console.log("linked videos")
      })
    else {
       this.video.videoFile = videoFile
    }
  }

  visibilityUpdated(option: DropdownOption){
    this.video.visibility = VisibilityEnum[option.id as keyof typeof VisibilityEnum]
  }

  colorUpdated(color: string){
    this.video.color = color;
  }

  questionTitleUpdated(text: string){
    this.selectedQuestion!.text = text
  }

  answerUpdated(answer: AnswerOption, index: number){
    this.selectedQuestion!.answerOptions![index] = answer
  }

  removeAnswer(index: number){
    this.selectedQuestion!.answerOptions?.splice(index, 1)
  }

  //endregion

  protected readonly Utils = Utils
  protected readonly faPlus = faPlus
  protected readonly faTrash = faTrash
}
