import {Component, inject, Input, OnInit} from '@angular/core';
import {MatTooltip} from "@angular/material/tooltip"
import {Comment, CommentService} from "../../../service/comment.service"
import {Utils} from "../../../utils"
import {FormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEllipsis} from "@fortawesome/free-solid-svg-icons";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {NgIf} from "@angular/common";
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component"
import {MatButton} from "@angular/material/button"
import {VideoCommentComponent} from "../video-comment/video-comment.component"


@Component({
  selector: 'app-video-comment-container',
  standalone: true,
  imports: [
    MatTooltip,
    FormsModule,
    FaIconComponent,
    NgIf,
    IconButtonComponent,
    MatButton,
    VideoCommentComponent,
  ],
  templateUrl: './video-comment-container.component.html',
  styleUrl: './video-comment-container.component.scss'
})
export class VideoCommentContainerComponent implements OnInit {
  @Input() videoId: number = 0;
  @Input() comments: Comment[] | undefined = [];
  protected readonly Utils = Utils
  protected readonly faEllipsis = faEllipsis;

  commentService = inject(CommentService)
  commentInputText : string = ''

  ngOnInit(): void {
    this.updateComments()
  }

  keyDownFunction(event: any) {
    if(event.keyCode == 13) {
      this.postComment()
    }
  }

  postComment(){
    if(this.commentInputText.length > 0 && this.videoId){
      this.commentService.createComment(this.videoId, this.commentInputText).subscribe(response => {
        this.commentInputText = ''
        this.updateComments()
      })
    }
  }

  updateComments(){
    if(this.videoId){
      this.commentService.getCommentList(this.videoId).subscribe(commentList => {
        console.log(commentList)
        this.comments = commentList
      })
    }
  }
}
