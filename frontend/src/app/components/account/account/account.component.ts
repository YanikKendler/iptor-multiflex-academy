import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NavigationComponent} from "../../base/navigation/navigation.component";
import {faChartSimple, faCirclePlay, faFileVideo, faGear, faUsersGear} from "@fortawesome/free-solid-svg-icons";
import {SettingsComponent} from "../settings/settings.component";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {ManageUsersComponent} from "../manage-users/manage-users.component";
import {NgClass, NgIf} from "@angular/common";
import {LearningPathIconComponent} from "../../icons/learning-path-icon/learning-path-icon.component"
import {VideoRequestsComponent} from "../video-requests/video-requests.component";
import {LearningpathsComponent} from "../learningpaths/learningpaths.component"
import {VideosComponent} from "../videos/videos.component"
import {UserStatisticsComponent} from "../user-statistics/user-statistics.component";
import {UserRoleEnum, UserService} from "../../../service/user.service"

export type AccountPage = "videos" | "learningpaths" | "manage-users" | "video-requests" | "user-statistics"

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
    UserStatisticsComponent,
    RouterOutlet,
    NgIf
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit{

  protected readonly faCirclePlay = faCirclePlay;
  protected readonly faGear = faGear;
  protected readonly faUsersGear = faUsersGear;

  protected userService = inject(UserService)

  currentPage: AccountPage

  constructor(private route: ActivatedRoute, private router: Router) {
    this.currentPage = route.snapshot.firstChild?.routeConfig?.path as AccountPage || "videos"
  }

  ngOnInit(): void {
  }

  switchPage(page: AccountPage){
    this.currentPage = page
    this.router.navigate(['/account/' + page])
  }

  userCanSeePage(page: AccountPage){
    //pages can only be viewed by employees and admins
    if(["videos", "learningpaths", "video-requests"].includes(page)){
      if([UserRoleEnum.EMPLOYEE, UserRoleEnum.ADMIN].includes(this.userService.userRole)){
        return true
      }
      return false
    }
    //pages can be viewed by employees, admins and managers
    else if(page === "manage-users") {
      if ([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.EMPLOYEE].includes(this.userService.userRole)) {
        return true
      }
      return false
    }
    //pages can be viewed by anyone
    return true
  }

  protected readonly faFileVideo = faFileVideo;
  protected readonly faChartSimple = faChartSimple;
}
