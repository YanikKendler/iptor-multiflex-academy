import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import dashjs, {MediaPlayer} from "dashjs"
import SpatialNavKeyCodes from "video.js/dist/types/utils/spatial-navigation-key-codes"
import play = SpatialNavKeyCodes.codes.play

@Component({
  selector: 'app-media-player',
  standalone: true,
  imports: [],
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements AfterViewInit {
  @ViewChild('video', { static: true }) videoTag!: ElementRef<HTMLVideoElement>;
/*
  myMediaSource: MediaSource;
*/
  videoSourceBuffer: SourceBuffer | undefined;
  currentPosition = 0;
  chunkSize = 100000;
  videoLength = 1961594;
  http = inject(HttpClient);

  constructor() {
    /*this.myMediaSource = new MediaSource();*/
  }

  ngAfterViewInit(): void {
    console.log(this.videoTag.nativeElement)

    let url = "http://localhost:8080/api/video/1/source.mpd"
    let player = MediaPlayer().create()
    player.initialize(this.videoTag.nativeElement, url, false)

    /*this.myMediaSource.addEventListener('sourceopen', this.onSourceOpen.bind(this));
    this.videoTag.nativeElement.src = URL.createObjectURL(this.myMediaSource);

    this.myMediaSource.addEventListener('sourceclose', () => {
      console.log('MediaSource closed');
    });

    this.myMediaSource.addEventListener('sourceended', () => {
      console.log('MediaSource ended');
    });

    this.myMediaSource.addEventListener('error', (event) => {
      console.error('MediaSource error:', event);
    });*/
  }

  /*play(){
    this.videoTag.nativeElement.play();
  }

  onSourceOpen() {
    console.log('Source open');
    this.videoSourceBuffer = this.myMediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');

    this.videoSourceBuffer?.addEventListener('error', (event) => {
      console.error('SourceBuffer error:', event);
    });

    this.videoSourceBuffer?.addEventListener('updateend', () => {
      console.log('SourceBuffer update ended');
      if (this.myMediaSource.readyState === 'open') {
        if (this.videoLength > this.currentPosition + this.chunkSize-1) {
          this.requestChunk(this.currentPosition, this.currentPosition + this.chunkSize-1)
          this.currentPosition += this.chunkSize;
        }
        else if(this.currentPosition < this.videoLength) {
          this.requestChunk(this.currentPosition, this.videoLength-1)
        }
        else{
          console.log("end of stream")
          /!*this.myMediaSource.endOfStream()*!/
        }
      }
    });

    this.requestChunk(0, this.chunkSize-1);
  }

  requestChunk(from:number, to:number){
    const rangeHeader = `bytes=${from}-${to}`;
    console.log("requesting chunk", rangeHeader)
    this.http.get('http://localhost:8080/api/video/teststream', { headers: { Range: rangeHeader }, responseType: 'arraybuffer' })
      .subscribe({
        next: (response) => {
          console.log("got response")
          if (this.videoSourceBuffer && this.myMediaSource.readyState === 'open') {
            try {
              this.videoSourceBuffer.appendBuffer(response);
            } catch (error) {
              console.error('Error appending buffer:', error);
            }
          } else {
            console.error('MediaSource is not open or SourceBuffer is undefined', this.videoSourceBuffer);
          }
        },
        error: (err) => {
          console.error('Failed to fetch video chunk:', err);
        }
      });
  }*/
}
