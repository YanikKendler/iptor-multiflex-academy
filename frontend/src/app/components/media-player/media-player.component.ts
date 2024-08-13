import {AfterViewInit, Component, ElementRef, inject, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import dashjs, {MediaPlayer} from "dashjs"
import {VideoDetail} from "../../service/video.service"

@Component({
  selector: 'app-media-player',
  standalone: true,
  imports: [],
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnChanges {
  @Input() video: VideoDetail | undefined;

  @ViewChild('video', { static: true }) videoTag!: ElementRef<HTMLVideoElement>;
  http = inject(HttpClient);

  constructor() {
    /*this.myMediaSource = new MediaSource();*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.video){
      let url = `http://localhost:8080/api/video/${this.video.videoId}/getVideoChunk/source.mpd#t=15`
      let player = MediaPlayer().create()
      player.initialize(this.videoTag.nativeElement, url, false)
    }
  }
}
