import {Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-request-video',
  standalone: true,
  imports: [],
  templateUrl: './request-video.component.html',
  styleUrl: './request-video.component.scss'
})
export class RequestVideoComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<RequestVideoComponent>);
  readonly data = inject<number>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.dialogRef.backdropClick().subscribe(() => {
      this.close()
    })

    this.dialogRef.keydownEvents().subscribe(event => {
      if(event.key === "Escape") {
        this.close()
      }
    })
  }

  close(){
    this.dialogRef.close();
  }
}
