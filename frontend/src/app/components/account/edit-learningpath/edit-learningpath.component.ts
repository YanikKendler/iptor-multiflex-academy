import {Component, ElementRef, inject, model, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {
  AnswerOption,
  Question,
  VideoDetailDTO,
  VideoFile, VideoOverviewDTO,
  VideoService,
  VisibilityEnum
} from "../../../service/video.service";
import {NgClass, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TextfieldComponent} from "../../basic/textfield/textfield.component"
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faClockRotateLeft, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
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
import {LearningPathDetailDTO, LearningPathEntryDTO, LearningPathService} from "../../../service/learning-path.service"
import {TagSelectorComponent} from "../../basic/tag-selector/tag-selector.component"
import {VideoEntryComponent} from "../video-entry/video-entry.component"
import {ContentEditHistoryComponent} from "../content-edit-history/content-edit-history.component";
import {UserService} from "../../../service/user.service"
import {faCircleQuestion} from "@fortawesome/free-regular-svg-icons"
import {MatSnackBar} from "@angular/material/snack-bar"

@Component({
  selector: 'app-edit-learningpath',
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
    TagSelectorComponent,
    VideoEntryComponent
  ],
  templateUrl: './edit-learningpath.component.html',
  styleUrl: './edit-learningpath.component.scss'
})
export class EditLearningpathComponent implements OnInit{
  readonly learningPathService = inject(LearningPathService);
  readonly videoService = inject(VideoService);
  readonly userService = inject(UserService);

  readonly dialogRef = inject(MatDialogRef<EditLearningpathComponent>);
  readonly data = inject<number>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar)

  learningPath: LearningPathDetailDTO = {} as LearningPathDetailDTO;
  oldLearningPath: LearningPathDetailDTO = {} as LearningPathDetailDTO; //used for checking for changes

  allVideos: VideoOverviewDTO[] = []
  videoOptions: VideoOverviewDTO[] = []

  @ViewChild(CdkMenuTrigger) videoPopupTrigger!: CdkMenuTrigger

  ngOnInit(): void {
    if(this.data > 0){ //editing existing learningpath
      this.learningPathService.getLearningPathDetails(this.data).subscribe(path => {
        this.learningPath = path;
        this.oldLearningPath= JSON.parse(JSON.stringify(this.learningPath)) //actual nested deep copy
      })
    }
    else{ //creating new learningpath
      this.learningPath = {
        contentId: -1,
        title: "",
        description: "",
        visibility: VisibilityEnum.self,
        color: Utils.generateRandomColor(),
        tags: [],
        entries: [],
        rating: 0,
        userId: 0,
        approved: false
      } as LearningPathDetailDTO
      this.oldLearningPath= JSON.parse(JSON.stringify(this.learningPath)) //actual nested deep copy
    }

    this.dialogRef.backdropClick().subscribe(() => {
      this.close()
    })

    this.dialogRef.keydownEvents().subscribe(event => {
      if(event.key === "Escape") {
        this.close()
      }
    })

    this.videoService.getAll().subscribe(videos => {
      this.allVideos = videos
    })

    window.addEventListener("beforeunload", this.beforeUnloadHandler);
  }

  beforeUnloadHandler = (event: Event) => {
    if(JSON.stringify(this.learningPath) !== JSON.stringify(this.oldLearningPath)){
      // Recommended
      event.preventDefault();

      // Included for legacy support, e.g. Chrome/Edge < 119
      event.returnValue = true;
    }
  };

  saveChanges() {
    if(this.learningPath.contentId > 0) { //saving changes to existing path
      this.learningPathService.updateLearningPath(this.learningPath).subscribe(result => {
        window.removeEventListener("beforeunload", this.beforeUnloadHandler);
        this.dialogRef.close();
        this.snackBar.open(`Changes to video "${this.learningPath.title}" were saved`, "", {duration: 2000})
      }, () => {
        this.snackBar.open("Sorry, your changes could not be saved. Please copy them to another place and try again later.", "", {duration: 5000})
      })
    }
    else { //creating new path
      this.learningPathService.createLearningPath(this.learningPath).subscribe(result => {
        window.removeEventListener("beforeunload", this.beforeUnloadHandler);
        this.snackBar.open(`Learninpath "${this.learningPath.title}" was created :D`, "", {duration: 2000})
        this.dialogRef.close();
      })
    }
  }

  close(){
    //compare the actual data currently in the video vs the data when the dialog was opened to see if there are any changes
    if(JSON.stringify(this.learningPath) !== JSON.stringify(this.oldLearningPath)){
      this.confirmClose()
    }
    else {
      window.removeEventListener("beforeunload", this.beforeUnloadHandler);
      this.dialogRef.close();
    }
  }

  confirmClose() {
    this.dialog.open(ConfirmComponent, {
      width: "400px",
      data: {
        message: "You have unsaved changes. Are you sure you want to close the editor?",
        buttons: {
          cancel: "Keep editing",
          confirm: "Discard changes"
        }
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if(confirm) {
        window.removeEventListener("beforeunload", this.beforeUnloadHandler);
        this.dialogRef.close();
      }
    })
  }

  openHistory() {
    this.dialog.open(ContentEditHistoryComponent, {
      width: "800px",
      data: {
        contentId: this.learningPath.contentId,
        videoTitle: this.learningPath.title
      }
    }).afterClosed().subscribe((confirm: boolean) => {
    })
  }

  generateVideoOptions(input: string) {
    this.videoOptions = this.allVideos.filter(video => !this.learningPath.entries.filter(t => t.videoId === video.contentId).length)
    this.videoOptions = this.videoOptions.filter(video => video.title.toLowerCase().includes(input.toLowerCase()))
  }

  //region UPDATE functions

  updateVideoPosition(video: LearningPathEntryDTO, position: number){
    let index = this.learningPath.entries.indexOf(video)
    let videoToSwapWIth = this.learningPath.entries[index + position]

    if(!videoToSwapWIth) return

    this.learningPath.entries[index + position].entryPosition -= position
    video.entryPosition += position

    this.learningPath.entries.sort((a, b) => a.entryPosition - b.entryPosition)
  }

  deleteVideoEntry(video: LearningPathEntryDTO){
    this.learningPath.entries = this.learningPath.entries.filter(v => v !== video)
  }

  visibilityUpdated(option: DropdownOption){
    this.learningPath.visibility = VisibilityEnum[option.id as keyof typeof VisibilityEnum]
  }

  colorUpdated(color: string){
    this.learningPath.color = color;
  }

  addVideoEntry(video: VideoOverviewDTO){
    this.learningPath.entries.push({
      pathEntryId: this.learningPath.entries.length * -1,
      videoId: video.contentId,
      videoTitle: video.title,
      durationSeconds: video.durationSeconds,
      questionCount: video.questionCount,
      entryPosition: this.learningPath.entries.length + 1,
      startTime: '1970-01-01T00:00:00',
      endTime: '1970-01-01T00:00:00',
      progress: 0
    })
    this.videoPopupTrigger.close()
  }

  //endregion

  protected readonly Utils = Utils
  protected readonly faPlus = faPlus
  protected readonly faTrash = faTrash
  protected readonly faClockRotateLeft = faClockRotateLeft;
  protected readonly faCircleQuestion = faCircleQuestion
}
