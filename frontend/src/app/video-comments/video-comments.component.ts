import {Component, Input} from '@angular/core';
import {CommentModel} from "../service/comment.service";
import {Utils} from "../utils"
import {MatTooltip} from "@angular/material/tooltip"

@Component({
  selector: 'app-video-comments',
  standalone: true,
  imports: [
    MatTooltip
  ],
  templateUrl: './video-comments.component.html',
  styleUrl: './video-comments.component.scss'
})
export class VideoCommentsComponent {
  @Input() comments: CommentModel[] | undefined;
    protected readonly Utils = Utils
}
