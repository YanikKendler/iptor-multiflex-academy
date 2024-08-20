import {Component, ElementRef, inject, model, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {VideoDetailDTO, VideoService, VisibilityEnum} from "../../../service/video.service";
import {NgClass, NgForOf} from "@angular/common";
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
import {Tag} from "../../../service/tag.service"
import {ChipComponent} from "../../basic/chip/chip.component"
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu"
import {MatMenuTrigger} from "@angular/material/menu"
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
    CdkMenuTrigger
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

  selectedQuestion: Question = {} as Question;

  allTags: Tag[] = [];
  tagOptions: Tag[] = [];

  @ViewChild(CdkMenuTrigger) tagPopupTrigger!: CdkMenuTrigger;
  @ViewChild("tagInput") tagInput!: ElementRef;

  ngOnInit(): void {
    console.log(this.data)
    this.videoService.getVideoDetails(this.data).subscribe(video => {
      this.video = video;
      this.oldVideo= {...video} //actual deep clone

      this.selectedQuestion = video.questions[0]
    })

    this.videoService.getAllTags().subscribe(tags => {
      this.allTags = tags
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
      let selectedQuestionPos = this.video.questions.indexOf(this.selectedQuestion)
      this.video = result;
      this.oldVideo = {...result}
      this.selectedQuestion = this.video.questions[selectedQuestionPos] || this.video.questions[0]
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

  addQuestion() {
    this.video.questions.push({text: "New Question", answerOptions: new Array<AnswerOption>()} as Question)
    this.selectedQuestion = this.video.questions[this.video.questions.length - 1]
    this.addAnswerOption()
  }

  addAnswerOption() {
    this.selectedQuestion.answerOptions.push({text: "New Answer"} as AnswerOption)
  }

  generateTagOptions(input: string) {
    console.log(this.video.tags)
    this.tagOptions = this.allTags.filter(tag => !this.video.tags.filter(videoTag => videoTag.tagId === tag.tagId).length)
    console.log(this.tagOptions)
    this.tagOptions = this.tagOptions.filter(tag => tag.name.toLowerCase().includes(input.toLowerCase()))
  }

  openTagPopup(){
    this.tagPopupTrigger.open()
    this.tagInput.nativeElement.focus()
  }

  createTag(name: string) {
    this.videoService.createTag(name).subscribe(tag => {
      this.addTag(tag)
    })
  }

  addTag(tag: Tag) {
    this.video.tags.push(tag)
    this.tagInput.nativeElement.value = ""
    this.generateTagOptions("")
  }

  removeTag(tag: Tag){
    this.video.tags = this.video.tags.filter(t => t.tagId !== tag.tagId)
    this.generateTagOptions("")
  }

  //region UPDATE functions

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

  colorUpdated(color: string){
    this.video.color = color;
  }

  questionTitleUpdated(text: string){
    this.selectedQuestion.text = text
  }

  answerUpdated(answer: AnswerOption, index: number){
    this.selectedQuestion.answerOptions[index] = answer
  }

  //endregion

  protected readonly Utils = Utils
  protected readonly faPlus = faPlus
}
