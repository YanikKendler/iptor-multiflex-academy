import {Component, inject, model} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VisibilityEnum} from "../../../service/video.service";
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";

export interface ContentData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-edit-pop-up',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './edit-pop-up.component.html',
  styleUrl: './edit-pop-up.component.scss'
})
export class EditPopUpComponent {
  visibilityOptions = Object.values(VisibilityEnum);

  readonly dialogRef = inject(MatDialogRef<EditPopUpComponent>);
  readonly data = inject<ContentData>(MAT_DIALOG_DATA);
  readonly title = model(this.data.title);
  readonly description = model(this.data.description);

  saveChanges() {
    this.dialogRef.close();
  }
}
