import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from "@angular/common"
import {FormsModule} from "@angular/forms";
import {max} from "rxjs";

@Component({
  selector: 'app-textfield',
  standalone: true,
  imports: [
    NgClass,
    FormsModule
  ],
  templateUrl: './textfield.component.html',
  styleUrl: './textfield.component.scss'
})
export class TextfieldComponent {
  @Input() label: string = "Label";
  @Input() placeholder: string = "";
  @Input() value: string = "";
  @Input() maxLength : number = 255
  @Output() valueChange = new EventEmitter<string>();
  @Input() rows: number = 1;
  @Input() small: boolean = false;

  protected readonly max = max;
}
