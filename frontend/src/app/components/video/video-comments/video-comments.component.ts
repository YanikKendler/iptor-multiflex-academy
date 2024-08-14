import {Component, inject, Input, OnInit} from '@angular/core';
import {MatTooltip} from "@angular/material/tooltip"
import {Comment, CommentService} from "../../../service/comment.service"
import {Utils} from "../../../utils"
import {FormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEllipsis} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-video-comments',
  standalone: true,
  imports: [
    MatTooltip,
    FormsModule,
    FaIconComponent,
  ],
  templateUrl: './video-comments.component.html',
  styleUrl: './video-comments.component.scss'
})
export class VideoCommentsComponent implements OnInit {
  @Input() videoId: number | undefined;
  @Input() userId: number | undefined;
  @Input() comments: Comment[] | undefined;
  protected readonly Utils = Utils

  commentService = inject(CommentService)

  commentText : string = ''

  ngOnInit(): void {
    this.updateComments()
  }

  keyDownFunction(event: any) {
    if(event.keyCode == 13) {
      this.postComment()
    }
  }

  postComment(){
    if(this.commentText.length > 0 && this.videoId && this.userId){
      this.commentService.createComment(this.videoId, this.commentText, this.userId).subscribe(response => {
        this.commentText = ''
        this.updateComments()
      })
    }
  }

  updateComments(){
    if(this.videoId && this.userId){
      this.commentService.getCommentList(this.videoId, this.userId).subscribe(commentList => {
        console.log(commentList)
        this.comments = commentList
      })
    }
  }

  protected readonly faEllipsis = faEllipsis;
}
