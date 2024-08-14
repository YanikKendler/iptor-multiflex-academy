import {Component, Input} from '@angular/core';
import {StarIconComponent} from "../../icons/star/star.icon.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-video-rating',
  standalone: true,
  imports: [
    StarIconComponent,
    NgForOf
  ],
  templateUrl: './video-rating.component.html',
  styleUrl: './video-rating.component.scss'
})
export class VideoRatingComponent {
  @Input() rating: number = 0
  numbers: number[] = [1, 2, 3, 4, 5]; // Array to loop through

  addRating(rating: number) {

  }
}
