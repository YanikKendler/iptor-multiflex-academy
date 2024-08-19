import {inject, Injectable} from '@angular/core';
import {Tag} from "./tag.service";
import {ViewProgress, VisibilityEnum} from "./video.service";
import {HttpClient} from "@angular/common/http";
import {Config} from "../config";

export interface LearningPathOverviewDTO {
  contentId: number;
  title: string;
  description: string;
  tags: Tag[];
  videoCount: number;
  viewProgress: ViewProgress;
  color: string;
  saved: boolean
}

export interface LearningPathDetailDTO {
  contentId: number;
  title: string;
  description: string;
  tags: Tag[];
  viewProgress: ViewProgress;
  visibility: VisibilityEnum;
  color: string;
  entries: LearningPathEntryDTO[];
}

export interface LearningPathEntryDTO {
  pathEntryId: number,
  videoId: number,
  videoTitle: string,
  entryPosition: number;
}

@Injectable({
  providedIn: 'root'
})
export class LearningPathService {
  service = inject(HttpClient)

  constructor() { }

  getLearningPathDetails(pathId: number){
    return this.service.get<LearningPathDetailDTO>(`${Config.BACKEND_URL}/api/learningpath/${pathId}?userId=${Config.USER_ID}`)
  }
}
