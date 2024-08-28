import {Component, HostBinding, inject, Input, OnInit, Renderer2} from '@angular/core';
import {StarIconComponent} from "../../icons/star/star.icon.component";
import {NgForOf} from "@angular/common";
import {StarRating, VideoService} from "../../../service/video.service";
import {MatButton} from "@angular/material/button"

@Component({
  selector: 'app-video-rating',
  standalone: true,
  imports: [
    StarIconComponent,
    NgForOf,
    MatButton
  ],
  templateUrl: './video-rating.component.html',
  styleUrl: './video-rating.component.scss',
  host: {
    "(mouseenter)": "enableRatingMode()"
  }
})
export class VideoRatingComponent{
  @Input() rating: number | undefined = 3.5
  @Input() videoId: number | undefined = 1
  @Input() userId: number | undefined = 1

  videoService = inject(VideoService)

  numbers: number[] = [1, 2, 3, 4, 5];
  isRatingMode : boolean = false
  yourRating: number = 0
  lastRating: number = 0
  buttonText: string = "update rating"

  @HostBinding('style.overflow')
  overflow = 'hidden';

  constructor(private renderer: Renderer2) {
    if(this.videoId && this.userId){
      this.videoService.getStarRating(this.videoId, this.userId).subscribe(response => {
        console.log(response)
        this.yourRating = response
      })
    }
  }

  setRating(rating: number) {
    if(window.matchMedia("(pointer: coarse)").matches) return

    this.yourRating = rating;
    this.isRatingMode = true;
  }

  buttonUpdateTimeout: any
  sendRating(){
    if(!this.videoId || !this.userId) return

    if(this.lastRating == this.yourRating) return
    this.lastRating = this.yourRating

    clearTimeout(this.buttonUpdateTimeout)

    this.videoService.setStarRating(this.videoId, this.userId, this.yourRating).subscribe(response => {
      console.log('Response from server:', response);
      this.updateRating()
      this.buttonText = "updated!"
      this.buttonUpdateTimeout = setTimeout(() => {
        this.buttonText = "update rating"
      },1000)
    })
  }

  getStarStateFromNumber(number: number){
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
    if(typeof this.rating == "number")
      return this.rating.toFixed(1);
    else
      return 0
  }

  updateRating(){
    if(this.videoId){
      this.videoService.getRatingAvgByVideo(this.videoId).subscribe(response => {
        this.rating = response;
      })
    }
  }

  hideTimeout: any
  disableRatingMode(){
    this.isRatingMode = false;
    this.hideTimeout = setTimeout(() => {
      this.overflow = 'hidden';
    },300)
  }

  enableRatingMode(){
    if(this.isRatingMode) return

    if(window.matchMedia("(pointer: coarse)").matches) return

    clearTimeout(this.hideTimeout)
    this.isRatingMode = true;
    this.overflow = 'visible';
  }
}
