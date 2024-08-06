import {Component, Input} from '@angular/core';
import {MatRipple} from "@angular/material/core"

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [
    MatRipple
  ],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss'
})
export class IconButtonComponent {
  @Input() size: string = '2.5rem';
}
