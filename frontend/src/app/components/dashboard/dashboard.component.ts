import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {NavigationComponent} from "../navigation/navigation.component"
import {VideoOverviewComponent} from "../video/video-overview/video-overview.component"
import {Router} from "@angular/router"
import {VideoOverviewDTO, VideoService, ViewProgress} from "../../service/video.service"
import {Utils} from "../../utils"
import {MediaPlayerComponent} from "../video/media-player/media-player.component"
import {HttpClient, HttpErrorResponse, HttpEventType} from "@angular/common/http"
import {StarIconComponent} from "../icons/star/star.icon.component"
import {PlayIconComponent} from "../icons/playicon/play.icon.component"
import {RemoveIconComponent} from "../icons/remove-icon/remove-icon.component"
import {ContentForUser, UserService} from "../../service/user.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NavigationComponent,
    VideoOverviewComponent,
    MediaPlayerComponent,
    StarIconComponent,
    PlayIconComponent,
    RemoveIconComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  service = inject(VideoService);
  userService = inject(UserService);
  videoList: VideoOverviewDTO[] | undefined;
  progressList: [number, ViewProgress][] | undefined;

  content: ContentForUser | undefined;

  @ViewChild('videoId', { static: true }) videoIdInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileId', { static: true }) fileIdInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.userService.getContentForUser(1).subscribe(content => {
      this.content = content;

      this.content.current.videos.forEach(video => {
        this.service.getVideoProgress(video.contentId, 1).subscribe(progress => {
          video.viewProgress = progress;
        }, error => {});
      })

      this.content.assigned.videos.forEach(video => {
        this.service.getVideoProgress(video.contentId, 1).subscribe(progress => {
          video.viewProgress = progress;
        }, error => {});
      })

      this.content.suggested.videos.forEach(video => {
        this.service.getVideoProgress(video.contentId, 1).subscribe(progress => {
          video.viewProgress = progress;
        }, error => {});
      })
    });

/*    console.log(Utils.toSmartTimeString(new Date()))
    console.log(Utils.toSmartTimeString(new Date("07.08.2024 20:54")))
    console.log(Utils.toSmartTimeString(new Date(1000*60*80)))
    console.log(Utils.toSmartTimeString(new Date("05.08.2024")))
    console.log(Utils.toSmartTimeString(new Date("07.06.2020")))*/
  }

  uploadFile(file: File) {
    const fileName = file.name;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('http://localhost:8080/api/video/upload?filename=' + fileName, formData);
  }

  linkVideo() {
    this.http.put(`http://localhost:8080/api/video/${this.videoIdInput.nativeElement.value}/linkVideoFile/${this.fileIdInput.nativeElement.value}`, {}, {observe: "response"}).subscribe(response => {
      console.log('video linked:', response);
    }, error => {
      console.error('There was an error:', error);
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.uploadFile(file).subscribe(response => {
        console.log('File uploaded successfully:', response);
      }, error => {
        console.error('There was an error uploading the file:', error);
      });
    }
  }
}
