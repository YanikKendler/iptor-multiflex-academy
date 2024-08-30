import {Component, inject, Input, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button"
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog"
import {faSquare, faSquareCheck} from "@fortawesome/free-regular-svg-icons"
import {FaIconComponent} from "@fortawesome/angular-fontawesome"
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component"
import {DotLoaderComponent} from "../../basic/dot-loader/dot-loader.component"

export interface ConfirmDialogueData {
  title: string
  message: string
  confirmMessage: string
  buttons: {
    confirm: string
    cancel: string
  }
}

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [
    MatButton,
    FaIconComponent,
    IconButtonComponent,
    DotLoaderComponent
  ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<ConfirmComponent>);
  readonly data: ConfirmDialogueData = inject<ConfirmDialogueData>(MAT_DIALOG_DATA);

  isChecked: boolean = true

  ngOnInit() {
    console.log(this.data)

    if(!this.data.title) {
      this.data.title = "Are you sure?"
    }

    if(!this.data.buttons){
      this.data.buttons = {
        confirm: "confirm",
        cancel: "cancel"
      }
    }

    if(!this.data.buttons?.cancel) {
      this.data.buttons.cancel = "cancel"
    }

    if(!this.data.buttons?.confirm) {
      this.data.buttons.confirm = "confirm"
    }

    if(this.data.confirmMessage) {
      this.isChecked = false
    }
  }

  protected readonly faSquareCheck = faSquareCheck
  protected readonly faSquare = faSquare
}
