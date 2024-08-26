import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NavigationComponent} from "../../base/navigation/navigation.component";
import {faCirclePlay, faFileVideo, faGear, faUsersGear} from "@fortawesome/free-solid-svg-icons";
import {SettingsComponent} from "../settings/settings.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ManageUsersComponent} from "../manage-users/manage-users.component";
import {NgClass} from "@angular/common";
import {MyVideosComponent} from "../my-videos/my-videos.component"
import {LearningPathIconComponent} from "../../icons/learning-path-icon/learning-path-icon.component"
import {MyLearningpathsComponent} from "../my-learningpaths/my-learningpaths.component"
import {VideoRequestsComponent} from "../video-requests/video-requests.component";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    FaIconComponent,
    NavigationComponent,
    SettingsComponent,
    MyVideosComponent,
    ManageUsersComponent,
    NgClass,
    LearningPathIconComponent,
    MyLearningpathsComponent,
    VideoRequestsComponent
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit{

  protected readonly faCirclePlay = faCirclePlay;
  protected readonly faGear = faGear;
  protected readonly faUsersGear = faUsersGear;

  currentPage = 'settings'

  constructor(private route: ActivatedRoute, private router: Router) {  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
        this.currentPage = params['page'] || 'settings'
    })
  }

  switchPage(page: "my-videos" | "my-learningpaths" | "manage-users" | "video-requests"){
    this.router.navigate(['/account/' + page])
  }

  protected readonly faFileVideo = faFileVideo;
}
