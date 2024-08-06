import {Component, Input} from '@angular/core';
import {CommentModel} from "../service/comment.service";

@Component({
  selector: 'app-video-comments',
  standalone: true,
  imports: [],
  templateUrl: './video-comments.component.html',
  styleUrl: './video-comments.component.scss'
})
export class VideoCommentsComponent {
  @Input() comments: CommentModel[] | undefined;
}
