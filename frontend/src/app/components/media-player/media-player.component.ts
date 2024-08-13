import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  SimpleChanges, viewChild,
  ViewChild
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import dashjs, {MediaPlayer} from "dashjs"
import {VideoDetail} from "../../service/video.service"
import {FaIconComponent, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { faFrownOpen } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-media-player',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnChanges {
  @Input() video: VideoDetail | undefined;

  @ViewChild('video') videoTag!: ElementRef<HTMLVideoElement>;
  http = inject(HttpClient);

  errorState: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if(this.video && this.video.videoFile){
      this.errorState = false

      setTimeout(() => {
        if(this.videoTag) {
          let url = `http://localhost:8080/api/video/${this.video?.videoId}/getVideoChunk/source.mpd#t=15`
          let player = MediaPlayer().create()
          player.initialize(this.videoTag.nativeElement, url, false)
        }
      },0)
    }
    else {
      this.errorState = true
    }
  }

  protected readonly faFrownOpen = faFrownOpen
}
