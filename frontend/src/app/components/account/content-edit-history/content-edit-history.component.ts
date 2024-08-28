import {Component, inject, OnInit} from '@angular/core';
import {ContentEditHistoryDTO, UserService} from "../../../service/user.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {VideoOverviewDTO, VideoService} from "../../../service/video.service";
import {Utils} from "../../../utils";

@Component({
  selector: 'app-content-edit-history',
  standalone: true,
  imports: [],
  templateUrl: './content-edit-history.component.html',
  styleUrl: './content-edit-history.component.scss'
})
export class ContentEditHistoryComponent implements OnInit{
  readonly data = inject(MAT_DIALOG_DATA);
  video : VideoOverviewDTO = {} as VideoOverviewDTO;
  userService = inject(UserService);
  videoService = inject(VideoService);
  contentEditHistory: ContentEditHistoryDTO[] = [];

  ngOnInit(): void {
    this.userService.getContentHistory(this.data.contentId).subscribe(contentEditHistory => {
      console.log(contentEditHistory)
      this.contentEditHistory = contentEditHistory;
    });
  }

  protected readonly Utils = Utils;
}
