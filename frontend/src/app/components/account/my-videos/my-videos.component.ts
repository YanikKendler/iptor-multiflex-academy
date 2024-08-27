import {Component, inject, model, OnInit, signal, ViewChild} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  faArrowRightToBracket,
  faShareFromSquare,
  faEye,
  faPen,
  faSortDown,
  faStar,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import {faPlayCircle} from "@fortawesome/free-regular-svg-icons";
import {RouterLink} from "@angular/router";
import {MatDialog, matDialogAnimations, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {EditVideoComponent} from "../edit-video/edit-video.component"
import {ConfirmComponent} from "../../dialogue/confirm/confirm.component"
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {VideoAndLearningPathOverviewCollection, VideoService, VisibilityEnum} from "../../../service/video.service";
import {MyLearningpathDTO, UserService} from "../../../service/user.service";
import {Tag} from "../../../service/tag.service";
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {MatButton} from "@angular/material/button";
import {PlayIconComponent} from "../../icons/playicon/play.icon.component";
import {DropdownComponent, DropdownOption} from "../../basic/dropdown/dropdown.component"
import {Utils} from "../../../utils"
import {MatTooltip} from "@angular/material/tooltip"
import {ExtremeConfirmComponent} from "../../dialogue/extreme-confirm/extreme-confirm.component";

@Component({
  selector: 'app-my-videos',
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
    MatTooltip
  ],
  templateUrl: './my-videos.component.html',
  styleUrl: './my-videos.component.scss'
})
export class MyVideosComponent implements OnInit{
  protected readonly faPlayCircle = faPlayCircle;
  protected readonly faEye = faEye;
  protected readonly faStar = faStar;
  protected readonly faPen = faPen;

  userService = inject(UserService);
  videoService = inject(VideoService);

  userContent : MyLearningpathDTO[] = [];

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      this.getUserContent();
    })
  }

  getUserContent() {
    this.userService.getUserVideos().subscribe((data) => {
      this.userContent = data;
      console.log(this.userContent)
    });
  }

  readonly dialog = inject(MatDialog);

  openEditPopUp(videoId: number) {
    let dialogRef = this.dialog.open(EditVideoComponent, {
      maxWidth: "80vw",
      width: "800px",
      disableClose: true,
      data: videoId
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUserContent();
    });
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
      text += tag.name + ", ";
    })

    return text.substring(0, 24) + (text.length > 24 ? "..." : "");*/

    return tags.map(tag => tag.name).join(", ");
  }

  updateVisibility(videoId: number, selectedOption: DropdownOption) {
    const visibilityEnumValue = VisibilityEnum[selectedOption.id as keyof typeof VisibilityEnum];
    this.videoService.updateVideoVisibility(videoId, visibilityEnumValue);
  }

  deleteVideo(videoId: number){
    let dialogRef = this.dialog.open(ExtremeConfirmComponent, {
      maxWidth: "80vw",
      width: "800px",
      disableClose: true,
      data: {
        title: "Delete Video",
        message: "Are you sure you want to delete this video?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.videoService.deleteVideo(videoId).subscribe(() => {
          this.userContent = this.userContent.filter(video => video.contentId != videoId);
        });
      }
    })
  }

  protected readonly faArrowRightToBracket = faArrowRightToBracket;
  protected readonly faTrash = faTrash;
  protected readonly faSortDown = faSortDown;
  protected readonly Utils = Utils
  protected readonly faShareFromSquare = faShareFromSquare
}
