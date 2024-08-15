import {Component, inject} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCirclePlay, faEdit, faEye, faPen, faPencil, faStar} from "@fortawesome/free-solid-svg-icons";
import {faPlayCircle} from "@fortawesome/free-regular-svg-icons";
import {RouterLink} from "@angular/router";
import {EditPopUpComponent} from "../edit-pop-up/edit-pop-up.component";
import {MatDialog, matDialogAnimations, MatDialogModule, MatDialogRef} from '@angular/material/dialog';


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

  protected readonly faCirclePlay = faCirclePlay;
  protected readonly faPlayCircle = faPlayCircle;
  protected readonly faEye = faEye;
  protected readonly faStar = faStar;
  protected readonly faEdit = faEdit;
  protected readonly faPencil = faPencil;
  protected readonly faPen = faPen;

  openEditPopUp() {
    let dialogRef = this.dialog.open(EditPopUpComponent, {
      width: '400px',
      height: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


}
