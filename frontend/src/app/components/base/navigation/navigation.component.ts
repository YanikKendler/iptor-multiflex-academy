import {Component, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {RouterLink} from "@angular/router"
import {
  faBell,
  faCirclePlay,
  faCircleUser,
  faEllipsis, faFileVideo,
  faGear, faListCheck, faMagnifyingGlass, faRightFromBracket,
  faTrash,
  faUser, faUserPlus,
  faUsersGear, faXmark
} from "@fortawesome/free-solid-svg-icons";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {MatButton} from "@angular/material/button";
import {TextfieldComponent} from "../../basic/textfield/textfield.component";
import {Config} from "../../../config";
import {LearningPathIconComponent} from "../../icons/learning-path-icon/learning-path-icon.component"
import {MatDivider} from "@angular/material/divider"
import {User, UserRoleEnum, UserService} from "../../../service/user.service"
import {Notification, NotificationService} from "../../../service/notification.service";
import {NotificationComponent} from "../notification/notification.component";
import {NgForOf} from "@angular/common";
import {EditVideoComponent} from "../../account/edit-video/edit-video.component";
import {MatDialog} from "@angular/material/dialog";
import {RequestVideoComponent} from "../../account/request-video/request-video.component";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    RouterLink,
    CdkMenu,
    FaIconComponent,
    IconButtonComponent,
    MatButton,
    CdkMenuTrigger,
    TextfieldComponent,
    LearningPathIconComponent,
    TextfieldComponent,
    LearningPathIconComponent,
    MatDivider,
    NotificationComponent,
    NgForOf
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit{
  userService = inject(UserService)
  @Input() simple: boolean = false;
  @Output() search = new EventEmitter<string>();
  @ViewChild(CdkMenuTrigger) trigger!: CdkMenuTrigger;

  notificationService = inject(NotificationService)
  notificationList : Notification [] = []

  ngOnInit(): void {
    this.notificationService.getNotifications().subscribe(notifications => {
      console.log(notifications)
      this.notificationList = notifications
    })
  }

  readonly dialog = inject(MatDialog);
  requestVideo(){
    this.openEditPopUp(-1)
  }
  openEditPopUp(videoId: number) {
    let dialogRef = this.dialog.open(RequestVideoComponent, {
      maxWidth: "80vw",
      width: "800px",
      disableClose: true,
      data: videoId
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  closeMenu() {
    this.trigger.close();
  }

  logout() {
    localStorage.removeItem("IMA_USER_ID")
    localStorage.removeItem("IMA_USER_PASSWORD")
    this.userService.currentUser.next({userId: -1} as User)
  }

  protected readonly Notification = Notification;
  protected readonly UserRoleEnum = UserRoleEnum

  protected readonly faTrash = faTrash;
  protected readonly faEllipsis = faEllipsis;
  protected readonly faUser = faUser;
  protected readonly faCircleUser = faCircleUser;
  protected readonly faGear = faGear;
  protected readonly faCirclePlay = faCirclePlay;
  protected readonly faUsersGear = faUsersGear;
  protected readonly faBell = faBell;
  protected readonly faMagnifyingGlass = faMagnifyingGlass;
  protected readonly faXmark = faXmark
  protected readonly faRightFromBracket = faRightFromBracket;
  protected readonly faUserPlus = faUserPlus;
  protected readonly faListCheck = faListCheck;
  protected readonly faFileVideo = faFileVideo;
}


