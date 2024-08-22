import {Component, ElementRef, inject, OnChanges, OnInit, ViewChild} from '@angular/core';
import {NavigationComponent} from "../navigation/navigation.component"
import {UpdateVideoDashboardEvent, VideoOverviewComponent} from "../../video/video-overview/video-overview.component"
import {
  VideoAndLearningPathOverviewCollection,
  VideoOverviewDTO,
  VideoService,
  ViewProgress,
  VisibilityEnum
} from "../../../service/video.service"
import {MediaPlayerComponent} from "../../basic/media-player/media-player.component"
import {HttpClient} from "@angular/common/http"
import {StarIconComponent} from "../../icons/star/star.icon.component"
import {RemoveIconComponent} from "../../icons/remove-icon/remove-icon.component"
import {ViewProgressService} from "../../../service/view-progress.service"
import {ContentForUser, UserService} from "../../../service/user.service";
import {
  LearningPathOverviewComponent, UpdateLearningPathDashboardEvent
} from "../../learning-path/learning-path-overview/learning-path-overview.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {PlayIconComponent} from "../../icons/playicon/play.icon.component";
import {Config} from "../../../config";
import {FilterSidebarComponent} from "../filter-sidebar/filter-sidebar.component";
import {Tag} from "../../../service/tag.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NavigationComponent,
    VideoOverviewComponent,
    MediaPlayerComponent,
    StarIconComponent,
    RemoveIconComponent,
    LearningPathOverviewComponent,
    FaIconComponent,
    PlayIconComponent,
    FilterSidebarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  videoService = inject(VideoService);
  userService = inject(UserService);

  content: ContentForUser | undefined;
  filterTags: Tag[] = [];
  isSearchContent: boolean = false;
  searchTerm : string = ""

  @ViewChild('videoId', { static: true }) videoIdInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileId', { static: true }) fileIdInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.content = undefined
    this.getLocalStorageTags()
    this.loadContent()

    /*    console.log(Utils.toSmartTimeString(new Date()))
        console.log(Utils.toSmartTimeString(new Date("07.08.2024 20:54")))
        console.log(Utils.toSmartTimeString(new Date(1000*60*80)))
        console.log(Utils.toSmartTimeString(new Date("05.08.2024")))
        console.log(Utils.toSmartTimeString(new Date("07.06.2020")))*/
  }

  getLocalStorageTags(){
    let tags = localStorage.getItem("selectedTags");
    if(tags){
      this.filterTags = JSON.parse(tags) as Tag[];
    }
  }

  loadContent(): void{
    if(this.isSearchContent){
      this.videoService.searchContent(this.searchTerm, this.filterTags).subscribe(response => {
        this.content = response
      });
      return
    }

    this.userService.getContentForUser(this.filterTags).subscribe(content => {
      this.content = content;
    });
  }

  searchContent(elem: string) {
    this.isSearchContent = !(!elem && elem.length <= 0);
    this.searchTerm = elem
    this.loadContent()
  }

  updateVideoDashboard(event?: UpdateVideoDashboardEvent) {
    if(event){
      if(event.action === "add"){
        if(!this.content?.current.videos.includes(event.video)){
          event.video.saved = true;
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

  updateLearningPathDashboard(event?: UpdateLearningPathDashboardEvent){
    if(event){
      if(event.action === "add"){
        event.learningPath.saved = true;
        if(!this.content?.current.learningPaths.includes(event.learningPath)){
          this.content?.current.learningPaths.push(event.learningPath)
        }
      } else {
        if (this.content && this.content.current) {
          this.content.current.learningPaths = this.content.current.learningPaths.filter(video => video.contentId !== event.learningPath.contentId);

          this.content.assigned.learningPaths = this.content.assigned.learningPaths.map(learningPath => {
            learningPath.saved = false;
            return learningPath;
          });

          this.content.suggested.learningPaths = this.content.suggested.learningPaths.map(learningPath => {
            learningPath.saved = false;
            return learningPath;
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

  debounce(func: Function, timeout = 300) {
    let timer: any;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  private debouncedSearch = this.debounce((event: any) => this.searchContent(event), 300);

  processSearch(event: any) {
    this.debouncedSearch(event);
  }
}
