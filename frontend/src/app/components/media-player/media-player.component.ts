import {AfterViewInit, Component, ElementRef, inject, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import dashjs, {MediaPlayer} from "dashjs"

@Component({
  selector: 'app-media-player',
  standalone: true,
  imports: [],
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnChanges {
  @Input() videoId: number | undefined;

  @ViewChild('video', { static: true }) videoTag!: ElementRef<HTMLVideoElement>;
  http = inject(HttpClient);

  constructor() {
    /*this.myMediaSource = new MediaSource();*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(typeof this.videoId == "number" && this.videoId > 0){
      let url = `http://localhost:8080/api/video/${this.videoId}/getVideoChunk/source.mpd`
      let player = MediaPlayer().create()
      player.initialize(this.videoTag.nativeElement, url, false)
    }
  }
}
