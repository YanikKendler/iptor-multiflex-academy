import {Component, inject} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";



@Component({
  selector: 'app-edit-pop-up',
  standalone: true,
  imports: [],
  templateUrl: './edit-pop-up.component.html',
  styleUrl: './edit-pop-up.component.scss'
})
export class EditPopUpComponent {
  readonly dialogRef = inject(MatDialogRef<EditPopUpComponent>);
}
