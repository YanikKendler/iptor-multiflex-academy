import {Component, inject, model, signal} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCirclePlay, faEdit, faEye, faPen, faPencil, faStar} from "@fortawesome/free-solid-svg-icons";
import {faPlayCircle} from "@fortawesome/free-regular-svg-icons";
import {RouterLink} from "@angular/router";
import {MatDialog, matDialogAnimations, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {EditVideoComponent} from "../edit-video/edit-video.component"
import {ConfirmComponent} from "../../dialogue/confirm/confirm.component"


@Component({
  selector: 'app-my-content',
  standalone: true,
  imports: [
    FaIconComponent,
    RouterLink
  ],
  templateUrl: './my-content.component.html',
  styleUrl: './my-content.component.scss'
})
export class MyContentComponent {

  readonly dialog = inject(MatDialog);


  constructor() {
    let dialogRef = this.dialog.open(EditVideoComponent, {
      maxWidth: "80vw",
      width: "800px",
      height: "800px",
      disableClose: true,
      data: 1
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }


  protected readonly faPlayCircle = faPlayCircle;
  protected readonly faEye = faEye;
  protected readonly faStar = faStar;
  protected readonly faPen = faPen;
}
