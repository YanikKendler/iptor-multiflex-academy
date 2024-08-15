import {Component, inject, Input, OnInit} from '@angular/core';
import {MatTooltip} from "@angular/material/tooltip"
import {Comment, CommentService} from "../../../service/comment.service"
import {Utils} from "../../../utils"
import {FormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEllipsis} from "@fortawesome/free-solid-svg-icons";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-video-comments',
  standalone: true,
  imports: [
    MatTooltip,
    FormsModule,
    FaIconComponent,
    NgIf,
  ],
  templateUrl: './video-comments.component.html',
  styleUrl: './video-comments.component.scss'
})
export class VideoCommentsComponent implements OnInit {
  @Input() videoId: number = 0;
  @Input() userId: number = 0;
  @Input() comments: Comment[] = [];
  protected readonly Utils = Utils
  protected readonly faEllipsis = faEllipsis;

  commentService = inject(CommentService)
  commentText : string = ''
  editComments: number[] = [];

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

  toggleEditMenu(id: number){
    if(this.editComments.includes(id)){
      this.editComments = this.editComments.filter(e => e !== id)
    }else{
      this.editComments.push(id)
      }
  }


  editComment(comment: Comment) {

  }

  deleteComment(comment: Comment) {
    this.commentService.deleteComment(this.videoId, this.userId, comment.commentId).subscribe(response => {
      this.updateComments()
    })
  }
}
