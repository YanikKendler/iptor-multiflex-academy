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
import {VideoDetail, VideoDetailDTO, VideoService} from "../../../service/video.service"
import {FaIconComponent, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { faFrownOpen } from '@fortawesome/free-regular-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {Utils} from "../../../utils"

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
  @Input() video: VideoDetailDTO | undefined;

  @ViewChild('video') videoTag!: ElementRef<HTMLVideoElement>
  @ViewChild('spinner') spinner!: ElementRef<HTMLElement>

  http = inject(HttpClient);
  service = inject(VideoService)

  loadingState: "done" | "loading" | "error" = "loading";
  player: dashjs.MediaPlayerClass | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.video){
      this.loadingState = "loading"

      setTimeout(() => {
        Utils.spinAnimation(this.spinner!.nativeElement)
      },0)
    }
    else if(!this.video.videoFile){
      this.loadingState = "error"
    }
    else {
      this.loadingState = "done"

      setTimeout(() => {
        if(this.videoTag) {
          let url = `http://localhost:8080/api/video/${this.video?.videoId}/getVideoFragment/manifest.mpd#t=${this.video?.viewProgress}`
          this.player = MediaPlayer().create()
          this.player.initialize(this.videoTag.nativeElement, url, false)
          this.player.on(MediaPlayer.events.PLAYBACK_PAUSED, this.updateProgress.bind(this))
        }
      },0)

      setInterval(this.updateProgress.bind(this), 3000)
    }
  }

  lastProgress = 0
  updateProgress(){
    let time = this.player!.time()
    if(time == this.lastProgress) return
    this.lastProgress = time

    this.service.setVideoProgress(this.video!.videoId, 1, time).subscribe(response => {})
    console.log("updating")
  }

  protected readonly faFrownOpen = faFrownOpen
  protected readonly faSpinner = faSpinner
}
