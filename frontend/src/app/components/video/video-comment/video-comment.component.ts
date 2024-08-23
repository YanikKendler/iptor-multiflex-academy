import { Component, EventEmitter, inject, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Utils } from "../../../utils";
import { faEllipsis, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconButtonComponent } from "../../basic/icon-button/icon-button.component";
import { MatButton } from "@angular/material/button";
import { MatTooltip } from "@angular/material/tooltip";
import { Comment, CommentService } from "../../../service/comment.service";
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from "@angular/cdk/menu";
import { Config } from "../../../config";
import { FormsModule } from "@angular/forms";
import {UserService} from "../../../service/user.service"

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
    CdkMenuItem,
    FormsModule
  ],
  templateUrl: './video-comment.component.html',
  styleUrl: './video-comment.component.scss'
})
export class VideoCommentComponent implements AfterViewInit {
  @Input() comment!: Comment;
  @Input() videoId!: number;
  @Input() videoOwnerId!: number;

  @Output() update = new EventEmitter<void>();

  userId = inject(UserService).currentUser.value.userId;
  editMode: boolean = false;

  commentService = inject(CommentService);

  @ViewChild(CdkMenuTrigger) trigger!: CdkMenuTrigger;
  @ViewChild('editInput') editInput!: ElementRef;

  ngAfterViewInit() {
    if (this.editMode) {
      this.editInput.nativeElement.focus();
    }
  }

  keyDownFunction(event: any) {
    if (event.keyCode == 13) {
      this.updateComment();
    } else if (event.keyCode == 27) {
      this.editMode = false;
    }
  }

  editComment() {
    this.editMode = true;
    this.trigger.close();
    setTimeout(() => this.editInput.nativeElement.focus(), 0);
  }

  updateComment() {
    this.commentService.updateComment(this.videoId, this.comment).subscribe(response => {
      this.editMode = false;
      this.update.emit();
    });
  }

  deleteComment(comment: Comment) {
    this.commentService.deleteComment(this.videoId, comment.commentId).subscribe(response => {
      this.update.emit();
    });
  }

  protected readonly Utils = Utils;
  protected readonly faTrash = faTrash;
  protected readonly faEllipsis = faEllipsis;
  protected readonly faPen = faPen;
}
