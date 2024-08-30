import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {
  User,
  UserAssignedContentDTO,
  UserRoleEnum,
  UserService,
  UserStatisticsDTO,
  UserTreeDTO
} from "../../../service/user.service";
import {Utils} from "../../../utils";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {ContentOverviewDTO, VideoOverviewDTO, VideoService} from "../../../service/video.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  faAngleDown,
  faChartSimple,
  faCirclePlay,
  faClose, faEllipsisH, faEllipsisV,
  faTrash, faUserMinus, faUserTie,
  faX,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {LearningPathIconComponent} from "../../icons/learning-path-icon/learning-path-icon.component";
import {Config} from "../../../config";
import {NgClass, NgIf} from "@angular/common"
import {MatTooltip} from "@angular/material/tooltip"
import {faCircleCheck, faSquareCheck} from "@fortawesome/free-regular-svg-icons";
import {NotificationComponent} from "../../base/notification/notification.component";
import {UserStatisticsComponent} from "../user-statistics/user-statistics.component";
import {MatDivider} from "@angular/material/divider"
import {MatButton} from "@angular/material/button"
import {ConfirmComponent} from "../../dialogue/confirm/confirm.component"
import {MatDialog} from "@angular/material/dialog"
import {MatSnackBar} from "@angular/material/snack-bar"

@Component({
  selector: 'app-manage-user-field',
  standalone: true,
  imports: [
    CdkMenu,
    CdkMenuTrigger,
    FaIconComponent,
    IconButtonComponent,
    LearningPathIconComponent,
    NgClass,
    NgIf,
    MatTooltip,
    NotificationComponent,
    UserStatisticsComponent,
    MatDivider,
    MatButton
  ],
  templateUrl: './manage-user-field.component.html',
  styleUrl: './manage-user-field.component.scss'
})
export class ManageUserFieldComponent implements OnInit {
  @Input() userTree: UserTreeDTO = {} as UserTreeDTO
  @Input() level: number = 0
  @Input() root: boolean = false

  @Output() updateUsers = new EventEmitter<void>()

  protected userService = inject(UserService)
  protected videoService = inject(VideoService)

  protected dialog = inject(MatDialog)
  protected snackBar = inject(MatSnackBar)

  assignedContent: UserAssignedContentDTO[] = []

  fullContent: ContentOverviewDTO[] = []
  contentOptions: ContentOverviewDTO[] = []

  isExpanded: boolean = false

  firstExpand: boolean = true

  userStatistics: UserStatisticsDTO = {} as UserStatisticsDTO

  // i tried so hard and got so far
  @ViewChildren(CdkMenuTrigger) videoPopupTrigger!: CdkMenuTrigger[]
  @ViewChild('statistics') statisticsPopupTrigger!: CdkMenuTrigger

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      if (this.userTree.userId > 0) {
        this.userService.getUserStatistics(this.userTree.userId).subscribe(stats => {
          this.userStatistics = stats
        })
      }
    })
  }

  toggle(event: Event) {
    if ((event.target as HTMLElement).closest('app-icon-button')) {
      return;
    }

    if (this.firstExpand) {
      this.videoService.getFullContent().subscribe(content => {
        this.fullContent = content
      })

      this.firstExpand = false
    }

    this.isExpanded = !this.isExpanded;

    if (!this.isExpanded) {
      return
    }

    this.userService.getAssignedUserContent(this.userTree.userId).subscribe(content => {
      this.assignedContent = content;
    })
  }

  protected readonly Utils = Utils;

  generateContentOptions(input: string) {
    this.contentOptions = this.fullContent.filter(content => !this.assignedContent.filter(t => t.contentId === content.contentId).length)
    this.contentOptions = this.contentOptions.filter(content => content.title.toLowerCase().includes(input.toLowerCase()))
  }

  assignContent(content: ContentOverviewDTO) {
    this.userService.assignContent(this.userTree.userId, content.contentId).subscribe(result => {
      this.assignedContent.push(result)

      this.generateContentOptions("")
    })

    this.videoPopupTrigger.forEach(t => t.close())
  }

  unassignContent(contentId: number) {
    this.assignedContent = this.assignedContent.filter(t => t.contentId !== contentId)
    this.userService.unassignContent(this.userTree.userId, contentId)
  }

  protected readonly faClose = faClose;
  protected readonly faCirclePlay = faCirclePlay;

  getTypeById(contentId: number) {
    return this.fullContent.find(t => t.contentId === contentId)?.type
  }

  updateRole(user: UserTreeDTO, newRole: UserRoleEnum) {
    this.userService.updateRole(user.userId, newRole).subscribe(() => {
      this.snackBar.open(`User: "${user.username}" is now a ${newRole}`, "", {duration: 2000})
      this.updateUsers.emit()
    })
  }

  deleteUser(user: UserTreeDTO) {
    console.log("deleting")

    let dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: "Delete User",
        message: `The User "${user.username}" will be lost forever. Any Content created by this user will be re-assigned to yourself. Ratings, Comments, Notifications, View Progresses and Quiz Results will be deleted. All users where "${user.username}" was a (deputy) supervisor will now be your subordinates. This action cannot be undone. Are you sure?`,
        confirmMessage: `Delete User: "${user.username}"`,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.userId).subscribe(() => {
          this.snackBar.open(`User: "${user.username}" was deleted`, "", {duration: 2000})
          this.updateUsers.emit()
          console.log("update emited")
        });
      }
    })
  }

  protected readonly Config = Config;
  protected readonly inject = inject
  protected readonly faTrash = faTrash
  protected readonly faAngleDown = faAngleDown
  protected readonly faCircleCheck = faCircleCheck;
  protected readonly faSquareCheck = faSquareCheck;
  protected readonly faXmark = faXmark;
  protected readonly faChartSimple = faChartSimple;
  protected readonly faEllipsisH = faEllipsisH
  protected readonly faUserTie = faUserTie
  protected readonly UserRoleEnum = UserRoleEnum
  protected readonly faUserMinus = faUserMinus
}
