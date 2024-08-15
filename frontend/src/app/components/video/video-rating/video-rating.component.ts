import {Component, inject, Input, OnInit} from '@angular/core';
import {StarIconComponent} from "../../icons/star/star.icon.component";
import {NgForOf} from "@angular/common";
import {StarRating, VideoService} from "../../../service/video.service";

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
export class VideoRatingComponent{
  @Input() rating: number | undefined = 3.5
  @Input() videoId: number | undefined = 1
  @Input() userId: number | undefined = 1
  numbers: number[] = [1, 2, 3, 4, 5];

  videoService = inject(VideoService)

  isRatingMode : boolean = false
  yourRating: number = 0

  color: string = 'black';

  constructor() {
    if(this.videoId && this.userId){
      this.videoService.getStarRating(this.videoId, this.userId).subscribe(response => {
        console.log(response)
        this.yourRating = response
      })
    }
  }

  setRating(rating: number) {
    this.yourRating = rating;
    this.isRatingMode = true;
  }

  sendRating(){
    if(this.videoId && this.userId && this.yourRating){
      console.log("sending rating", this.yourRating)
      this.videoService.setStarRating(this.videoId, this.userId, this.yourRating).subscribe(response => {
        console.log('Response from server:', response);
        this.updateRating()
      })
    }
  }

  getTypeByNumber(number: number){
    let value = this.rating
    if(this.isRatingMode){
      value = this.yourRating
    }

    if(value){
      if (value >= number) {
        return 'filled';
      } else if (number - value <= 0.5) {
        return 'half';
      }
    }

    return "outlined"
  }

  getDoubleDigitRating() {
    return this.rating?.toFixed(1);
  }

  updateRating(){
    if(this.videoId){
      this.videoService.getRatingAvgByVideo(this.videoId).subscribe(response => {
        this.rating = response;
      })
    }
  }
}
