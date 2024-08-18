import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-textfield',
  standalone: true,
  imports: [],
  templateUrl: './textfield.component.html',
  styleUrl: './textfield.component.scss'
})
export class TextfieldComponent {
  @Input() label: string = "Lable";
  @Input() placeholder: string = "";
  @Input() value: string = "";
  @Output() valueChange = new EventEmitter<string>();
  @Input() rows: number = 1;
}
