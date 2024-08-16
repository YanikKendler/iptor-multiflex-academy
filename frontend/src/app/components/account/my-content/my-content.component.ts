import {Component, inject, model, signal, ViewChild} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  faArrowRightToBracket,
  faCirclePlay,
  faEdit,
  faEye,
  faPen,
  faPencil, faSortDown,
  faStar, faTrash
} from "@fortawesome/free-solid-svg-icons";
import {faPlayCircle} from "@fortawesome/free-regular-svg-icons";
import {RouterLink} from "@angular/router";
import {EditPopUpComponent} from "../edit-pop-up/edit-pop-up.component";
import {MatDialog, matDialogAnimations, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {VideoAndLearningPathOverviewCollection, VideoService, VisibilityEnum} from "../../../service/video.service";
import {MyVideoContentDTO, UserService} from "../../../service/user.service";
import {Tag} from "../../../service/tag.service";
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {PlayIconComponent} from "../../icons/playicon/play.icon.component";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {MatButton} from "@angular/material/button";


@Component({
  selector: 'app-my-content',
  standalone: true,
  imports: [
    FaIconComponent,
    RouterLink,
    FormsModule,
    NgForOf,
    IconButtonComponent,
    PlayIconComponent,
    CdkMenu,
    MatButton,
    CdkMenuTrigger
  ],
  templateUrl: './my-content.component.html',
  styleUrl: './my-content.component.scss'
})
export class MyContentComponent {
  protected readonly faPlayCircle = faPlayCircle;
  protected readonly faEye = faEye;
  protected readonly faStar = faStar;
  protected readonly faPen = faPen;

  @ViewChild(CdkMenuTrigger) menuTrigger!: CdkMenuTrigger;
  visibilityOptions = Object.values(VisibilityEnum);

  userService = inject(UserService);
  videoService = inject(VideoService);

  userContent : MyVideoContentDTO[] = [];

  constructor() {
    this.userService.getUserContent().subscribe((data) => {
      this.userContent = data;
      console.log(this.userContent)
    });
  }

  readonly dialog = inject(MatDialog);
  readonly title = signal('');
  readonly description = signal('');

  openEditPopUp() {
    let dialogRef = this.dialog.open(EditPopUpComponent, {
      data: {title: this.title(), description: this.description()}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
      if (result !== undefined) {
        this.title.set(result);
      }
      console.log(this.title)
    });
  }

  getQuestionCountToString(questionCount:number){
    if(questionCount == 0){
      return "no questions"
    } else {
      return questionCount + " questions"
    }
  }

  getTags(tags: Tag[]) {
    let text = ""
    tags.forEach(tag => {
      text += tag.name + ", ";
    })

    return text.substring(0, 24) + (text.length > 24 ? "..." : "");
  }

  protected readonly faArrowRightToBracket = faArrowRightToBracket;

  updateVisibility(videoId: number, visibility: string) {
    console.log(videoId, visibility);
    const visibilityEnumValue = VisibilityEnum[visibility as keyof typeof VisibilityEnum];

    this.userContent.forEach((content) => {
      if (content.contentId === videoId) {
        content.visibility = visibilityEnumValue;
      }
    });

    this.videoService.updateVideoVisibility(videoId, visibilityEnumValue);

    this.menuTrigger.close();
  }

  protected readonly faTrash = faTrash;
  protected readonly faSortDown = faSortDown;
}
