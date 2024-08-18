import {Component, inject, Input, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button"
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog"

export interface ConfirmDialogueData {
  title: string
  message: string
}

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<ConfirmComponent>);
  readonly data: ConfirmDialogueData = inject<ConfirmDialogueData>(MAT_DIALOG_DATA);

  ngOnInit() {
    if(!this.data.title) {
      this.data.title = "Are you sure?"
    }
  }
}
