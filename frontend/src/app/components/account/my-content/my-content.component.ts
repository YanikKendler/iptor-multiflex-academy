import {Component, inject, model, signal} from '@angular/core';
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
  protected readonly faPlayCircle = faPlayCircle;
  protected readonly faEye = faEye;
  protected readonly faStar = faStar;
  protected readonly faPen = faPen;

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
}
