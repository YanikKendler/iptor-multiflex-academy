import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Utils} from "../../../utils"
import {faEllipsis, faTrash} from "@fortawesome/free-solid-svg-icons"
import {FaIconComponent} from "@fortawesome/angular-fontawesome"
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component"
import {MatButton} from "@angular/material/button"
import {MatTooltip} from "@angular/material/tooltip"
import {Comment, CommentService} from "../../../service/comment.service"
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from "@angular/cdk/menu"
import {Config} from "../../../config"

@Component({
  selector: 'app-video-comment',
  standalone: true,
  imports: [
    FaIconComponent,
    IconButtonComponent,
    MatButton,
    MatTooltip,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem
  ],
  templateUrl: './video-comment.component.html',
  styleUrl: './video-comment.component.scss'
})
export class VideoCommentComponent {
  @Input() comment!: Comment
  @Input() videoId!: number

  @Output() update = new EventEmitter<void>();

  userId = Config.USER_ID

  commentService = inject(CommentService)

  editComment(comment: Comment) { }

  deleteComment(comment: Comment) {
    this.commentService.deleteComment(this.videoId, comment.commentId).subscribe(response => {
      this.update.emit()
    })
  }

  protected readonly Utils = Utils
  protected readonly faTrash = faTrash
  protected readonly faEllipsis = faEllipsis
}
