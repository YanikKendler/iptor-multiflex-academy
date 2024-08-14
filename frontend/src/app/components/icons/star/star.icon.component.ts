import {Component, Input} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as filled, faStarHalfStroke as half } from '@fortawesome/free-solid-svg-icons';
import { faStar as outlined } from '@fortawesome/free-regular-svg-icons';
import {NgStyle} from "@angular/common"

@Component({
  selector: 'app-star-icon',
  standalone: true,
  imports: [FontAwesomeModule, NgStyle],
  templateUrl: './star.icon.component.html',
  styleUrl: './star.icon.component.scss'
})
export class StarIconComponent {
  @Input() state: "filled" | "outlined" | "half" = "outlined";
  @Input() size: string = '1.2rem';
  star = { filled, outlined, half };
}
