import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from "@angular/common"

@Component({
  selector: 'app-textfield',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './textfield.component.html',
  styleUrl: './textfield.component.scss'
})
export class TextfieldComponent {
  @Input() label: string = "Lable";
  @Input() placeholder: string = "";
  @Input() value: string = "";
  @Output() valueChange = new EventEmitter<string>();
  @Input() rows: number = 1;
  @Input() small: boolean = false;
}
