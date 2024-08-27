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
import {LearningPathIconComponent} from "../../icons/learning-path-icon/learning-path-icon.component"
import {LearningPathService} from "../../../service/learning-path.service"
import {EditLearningpathComponent} from "../edit-learningpath/edit-learningpath.component"
import {MatDivider} from "@angular/material/divider"
import {ExtremeConfirmComponent} from "../../dialogue/extreme-confirm/extreme-confirm.component";

@Component({
  selector: 'app-learningpaths',
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
    LearningPathIconComponent,
    MatDivider
  ],
  templateUrl: './learningpaths.component.html',
  styleUrl: './learningpaths.component.scss'
})
export class LearningpathsComponent implements OnInit{
  protected readonly faPlayCircle = faPlayCircle;
  protected readonly faEye = faEye;
  protected readonly faStar = faStar;
  protected readonly faPen = faPen;

  userService = inject(UserService);
  learningpathService = inject(LearningPathService);

  userLearningpaths : MyLearningpathDTO[] = [];

  getUserContent() {
    this.userService.getUserLearningpaths().subscribe((data) => {
      this.userLearningpaths = data;
    });
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      this.getUserContent();
    })
  }

  readonly dialog = inject(MatDialog);

  openEditPopUp(pathId: number) {
    let dialogRef = this.dialog.open(EditLearningpathComponent, {
      maxWidth: "80vw",
      width: "800px",
      disableClose: true,
      data: pathId
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUserContent();
    });
  }

  createVideo(){
    this.openEditPopUp(-1)
  }

  videoCountToString(questionCount:number){
    if(questionCount == 0){
      return "no videos"
    } else {
      return questionCount + " videos"
    }
  }

  getTags(tags: Tag[]) {
    return tags.map(tag => tag.name).join(", ");
  }

  updateVisibility(videoId: number, selectedOption: DropdownOption) {
    const visibilityEnumValue = VisibilityEnum[selectedOption.id as keyof typeof VisibilityEnum];
    this.learningpathService.updatePathVisibility(videoId, visibilityEnumValue);
  }

  deleteLearningPath(learningPathId: number) {
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
        this.learningpathService.deletePath(learningPathId).subscribe(() => {
          this.userLearningpaths = this.userLearningpaths.filter(learningpath => learningpath.contentId != learningPathId);
        });
      }
    })
  }

  protected readonly faTrash = faTrash;
  protected readonly Utils = Utils
  protected readonly faShareFromSquare = faShareFromSquare

  approvePath(contentId: number) {
      this.userService.approveContent(contentId).subscribe(response => {
          this.userLearningpaths.find(learningpath => learningpath.contentId == contentId)!.approved = true;
      })
  }
}
