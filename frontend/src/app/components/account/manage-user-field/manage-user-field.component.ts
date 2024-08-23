import {Component, inject, Input, OnInit, ViewChild} from '@angular/core';
import {User, UserAssignedContentDTO, UserService, UserTreeDTO} from "../../../service/user.service";
import {Utils} from "../../../utils";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {ContentOverviewDTO, VideoOverviewDTO, VideoService} from "../../../service/video.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCirclePlay, faClose} from "@fortawesome/free-solid-svg-icons";
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {LearningPathIconComponent} from "../../icons/learning-path-icon/learning-path-icon.component";
import {Config} from "../../../config";

@Component({
  selector: 'app-manage-user-field',
  standalone: true,
  imports: [
    CdkMenu,
    CdkMenuTrigger,
    FaIconComponent,
    IconButtonComponent,
    LearningPathIconComponent
  ],
  templateUrl: './manage-user-field.component.html',
  styleUrl: './manage-user-field.component.scss'
})
export class ManageUserFieldComponent implements OnInit {
  @Input() user: UserTreeDTO = {} as UserTreeDTO;
  @Input() subordinates : UserTreeDTO[] = [];
  @Input() level : number = 0;
  userService = inject(UserService)
  videoService = inject(VideoService)

  assignedContent : UserAssignedContentDTO[] = [];

  fullContent: ContentOverviewDTO[] = []
  contentOptions: ContentOverviewDTO[] = []

  isExpanded: boolean = false;

  @ViewChild(CdkMenuTrigger) videoPopupTrigger!: CdkMenuTrigger

  ngOnInit(): void {
    this.videoService.getFullContent().subscribe(content => {
      this.fullContent = content
    })
  }

  toggle() {
    this.isExpanded = !this.isExpanded;

    if(!this.isExpanded) {
      return
    }

    this.userService.getAssignedUserContent(this.user.userId).subscribe(content => {
      this.assignedContent = content;
    })
  }

  protected readonly Utils = Utils;

  generateContentOptions(input: string) {
    this.contentOptions = this.fullContent.filter(content => !this.assignedContent.filter(t => t.contentId === content.contentId).length)
    this.contentOptions = this.contentOptions.filter(content => content.title.toLowerCase().includes(input.toLowerCase()))
  }

  assignContent(content: ContentOverviewDTO){
    this.assignedContent.push({
      contentId: content.contentId,
      title: content.title,
      progressPercent: 0
    })
    this.videoPopupTrigger.close()

    this.userService.assignContent(this.user.userId, content.contentId)
  }

  unassignContent(contentId: number){
    this.assignedContent = this.assignedContent.filter(t => t.contentId !== contentId)
    this.userService.unassignContent(this.user.userId, contentId)
  }

  protected readonly faClose = faClose;
  protected readonly faCirclePlay = faCirclePlay;

  getTypeById(contentId: number) {
    return this.fullContent.find(t => t.contentId === contentId)?.type
  }

  protected readonly Config = Config;
    protected readonly inject = inject
}
