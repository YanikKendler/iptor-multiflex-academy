import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NavigationComponent} from "../../base/navigation/navigation.component";
import {faChartSimple, faCirclePlay, faFileVideo, faGear, faUsersGear} from "@fortawesome/free-solid-svg-icons";
import {SettingsComponent} from "../settings/settings.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ManageUsersComponent} from "../manage-users/manage-users.component";
import {NgClass} from "@angular/common";
import {LearningPathIconComponent} from "../../icons/learning-path-icon/learning-path-icon.component"
import {VideoRequestsComponent} from "../video-requests/video-requests.component";
import {LearningpathsComponent} from "../learningpaths/learningpaths.component"
import {VideosComponent} from "../videos/videos.component"
import {UserStatisticsComponent} from "../user-statistics/user-statistics.component";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    FaIconComponent,
    NavigationComponent,
    SettingsComponent,
    ManageUsersComponent,
    NgClass,
    LearningPathIconComponent,
    VideoRequestsComponent,
    LearningpathsComponent,
    VideosComponent,
    UserStatisticsComponent
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

  switchPage(page: "videos" | "learningpaths" | "manage-users" | "video-requests" | "user-statistics"){
    this.router.navigate(['/account/' + page])
  }

  protected readonly faFileVideo = faFileVideo;
  protected readonly faChartSimple = faChartSimple;
}
