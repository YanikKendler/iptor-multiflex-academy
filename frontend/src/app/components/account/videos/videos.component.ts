import {Component, inject, model, OnInit, signal, ViewChild} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  faArrowRightToBracket,
  faShareFromSquare,
  faEye,
  faPen,
  faSortDown,
  faStar,
  faTrash,
  faCheckCircle, faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import {faPlayCircle} from "@fortawesome/free-regular-svg-icons";
import {RouterLink} from "@angular/router";
import {MatDialog, matDialogAnimations, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {EditVideoComponent} from "../edit-video/edit-video.component"
import {ConfirmComponent} from "../../dialogue/confirm/confirm.component"
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {VideoAndLearningPathOverviewCollection, VideoService, VisibilityEnum} from "../../../service/video.service";
import {MyLearningpathDTO, MyVideoDTO, UserService} from "../../../service/user.service";
import {Tag} from "../../../service/tag.service";
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {MatButton} from "@angular/material/button";
import {PlayIconComponent} from "../../icons/playicon/play.icon.component";
import {DropdownComponent, DropdownOption} from "../../basic/dropdown/dropdown.component"
import {Utils} from "../../../utils"
import {MatTooltip} from "@angular/material/tooltip"
import {Config} from "../../../config"
import {MatSnackBar} from "@angular/material/snack-bar"

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [
    FaIconComponent,
    RouterLink,
    FormsModule,
    NgForOf,
    IconButtonComponent,
    CdkMenu,
    MatButton,
    CdkMenuTrigger,
    PlayIconComponent,
    DropdownComponent,
    MatTooltip,
    NgClass,
    NgIf
  ],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss'
})
export class VideosComponent implements OnInit{
  protected readonly faPlayCircle = faPlayCircle
  protected readonly faEye = faEye
  protected readonly faStar = faStar
  protected readonly faPen = faPen

  userService = inject(UserService)
  videoService = inject(VideoService)

  protected snackBar = inject(MatSnackBar)

  userContent : MyVideoDTO[] = []

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      if(user.userId <= 0) return

      this.getUserContent()
    })
  }

  getUserContent() {
    this.userService.getUserVideos().subscribe((data) => {
      this.userContent = data;
    });
  }

  readonly dialog = inject(MatDialog)

  openEditPopUp(videoId: number) {
    let dialogRef = this.dialog.open(EditVideoComponent, {
      maxWidth: "80vw",
      width: "800px",
      disableClose: true,
      data: videoId
    })

    dialogRef.afterClosed().subscribe(result => {
      this.getUserContent()
    })
  }

  createVideo(){
    this.openEditPopUp(-1)
  }

  getQuestionCountToString(questionCount:number){
    if(questionCount == 0){
      return "no questions"
    } else {
      return questionCount + " questions"
    }
  }

  getTags(tags: Tag[]) {
    //lol was n crazy code
    /*let text = ""
    tags.forEach(tag => {
      text += tag.name + ", "
    })

    return text.substring(0, 24) + (text.length > 24 ? "..." : "")*/

    return tags.map(tag => tag.name).join(", ")
  }

  updateVisibility(videoId: number, selectedOption: DropdownOption) {
    const visibilityEnumValue = VisibilityEnum[selectedOption.id as keyof typeof VisibilityEnum]
    this.videoService.updateVideoVisibility(videoId, visibilityEnumValue)
  }

  deleteVideo(video: MyVideoDTO){
    let dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: "Delete Video",
        message: `The Video "${video.title}" and all its questions will be lost forever. This action cannot be undone. Are you sure?`,
        confirmMessage: `Delete Video: "${video.title}"`,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.videoService.deleteVideo(video.contentId).subscribe(() => {
          this.userContent = this.userContent.filter(userContent => userContent.contentId != video.contentId)
          this.snackBar.open(`Video "${video!.title}" was deleted`, "", {duration: 2000})
        })
      }
    })
  }

  approveVideo(video: MyVideoDTO) {
    this.userService.approveContent(video.contentId).subscribe(response => {
      this.userContent.find(userContent => userContent.contentId == video.contentId)!.approved = true
      this.snackBar.open(`Video "${video!.title}" approved!`, "", {duration: 2000})
    })
  }

  protected readonly faArrowRightToBracket = faArrowRightToBracket
  protected readonly faTrash = faTrash
  protected readonly faSortDown = faSortDown
  protected readonly Utils = Utils
  protected readonly faShareFromSquare = faShareFromSquare
  protected readonly faCheckCircle = faCheckCircle
  protected readonly Config = Config
  protected readonly faInfoCircle = faInfoCircle
}
