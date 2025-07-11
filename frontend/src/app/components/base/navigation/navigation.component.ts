import {ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router"
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
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {EditVideoComponent} from "../../account/edit-video/edit-video.component";
import {MatDialog} from "@angular/material/dialog";
import {RequestVideoComponent} from "../../dialogue/request-video/request-video.component";
import {MatBadge} from "@angular/material/badge";
import {MatRipple} from "@angular/material/core"

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
    NgForOf,
    MatBadge,
    NgClass,
    MatRipple,
    NgIf
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit{
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

  userService = inject(UserService)
  @Input() simple: boolean = false;
  @Output() search = new EventEmitter<string>();
  @ViewChild(CdkMenuTrigger) trigger!: CdkMenuTrigger;

  readonly dialog = inject(MatDialog);

  notificationService = inject(NotificationService)
  notificationList : Notification [] = []
  fullNotificationList : Notification [] = []

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      if(user.userId <= 0) return

      this.notificationService.getNotifications().subscribe(notifications => {
        this.fullNotificationList = notifications
        this.notificationList = this.fullNotificationList
      })

      this.route.queryParams.subscribe(params => {
        console.log(params)
        if(params["notification"]){
          this.trigger.open()
        }
      })
    })
  }

  getLengthOfNewNotifications(){
    return this.notificationList.filter(n => !n.done).length
  }

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
    this.userService.updateCurrentUser({userId: -1} as User)
  }

  protected readonly Config = Config
  protected readonly UserService = UserService
}


