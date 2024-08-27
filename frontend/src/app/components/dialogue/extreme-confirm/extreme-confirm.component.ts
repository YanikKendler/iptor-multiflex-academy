import {Component, inject, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogueData} from "../confirm/confirm.component";
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faSquareCheck, faSquare} from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'app-extreme-confirm',
  standalone: true,
  imports: [
    MatButton,
    IconButtonComponent,
    FaIconComponent
  ],
  templateUrl: './extreme-confirm.component.html',
  styleUrl: './extreme-confirm.component.scss'
})
export class ExtremeConfirmComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<ExtremeConfirmComponent>);
  readonly data: ConfirmDialogueData = inject<ConfirmDialogueData>(MAT_DIALOG_DATA);

  isChecked: boolean = false

  ngOnInit() {
    if(!this.data.title) {
      this.data.title = "Are you sure?"
    }
  }

  protected readonly faSquareCheck = faSquareCheck;
  protected readonly faSquare = faSquare;
}
