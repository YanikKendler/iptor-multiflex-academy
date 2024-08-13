import {Component, Input} from '@angular/core';
import {MatTooltip} from "@angular/material/tooltip"
import {Comment} from "../../../service/comment.service"
import {Utils} from "../../../utils"

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
  @Input() comments: Comment[] | undefined;
    protected readonly Utils = Utils
}
