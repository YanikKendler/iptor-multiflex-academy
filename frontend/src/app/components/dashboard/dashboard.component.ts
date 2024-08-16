import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {NavigationComponent} from "../navigation/navigation.component"
import {UpdateDashboardEvent, VideoOverviewComponent} from "../video/video-overview/video-overview.component"
import {VideoOverviewDTO, VideoService, ViewProgress, VisibilityEnum} from "../../service/video.service"
import {MediaPlayerComponent} from "../video/media-player/media-player.component"
import {HttpClient} from "@angular/common/http"
import {StarIconComponent} from "../icons/star/star.icon.component"
import {PlayIconComponent} from "../icons/playicon/play.icon.component"
import {RemoveIconComponent} from "../icons/remove-icon/remove-icon.component"
import {ViewProgressService} from "../../service/view-progress.service"
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
  videoService = inject(VideoService);
  viewProgressService = inject(ViewProgressService);
  userService = inject(UserService);
  videoList: VideoOverviewDTO[] | undefined;
  progressList: [number, ViewProgress][] | undefined;

  content: ContentForUser | undefined;

  @ViewChild('videoId', { static: true }) videoIdInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileId', { static: true }) fileIdInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.content = undefined
    this.userService.getContentForUser().subscribe(content => {
      this.content = content;
    });

    /*    console.log(Utils.toSmartTimeString(new Date()))
        console.log(Utils.toSmartTimeString(new Date("07.08.2024 20:54")))
        console.log(Utils.toSmartTimeString(new Date(1000*60*80)))
        console.log(Utils.toSmartTimeString(new Date("05.08.2024")))
        console.log(Utils.toSmartTimeString(new Date("07.06.2020")))*/
  }

  updateDashboard(event?: UpdateDashboardEvent) {
    if(event){
      console.log(event)

      if(event.action === "add"){
        event.video.saved = true;
        if(!this.content?.current.videos.includes(event.video)){
          this.content?.current.videos.push(event.video)
        }
      } else {
        if (this.content && this.content.current) {
          this.content.current.videos = this.content.current.videos.filter(video => video.contentId !== event.video.contentId);

          this.content.assigned.videos = this.content.assigned.videos.map(video => {
            video.saved = false;
            return video;
          });

          this.content.suggested.videos = this.content.suggested.videos.map(video => {
            video.saved = false;
            return video;
          });
        }
      }
    }
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
