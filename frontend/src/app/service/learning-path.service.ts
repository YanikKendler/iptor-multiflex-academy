import {inject, Injectable} from '@angular/core';
import {Tag} from "./tag.service";
import {VideoDetailDTO, ViewProgress, VisibilityEnum} from "./video.service";
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
  viewProgress?: ViewProgress;
  visibility: VisibilityEnum;
  color?: string;
  entries: LearningPathEntryDTO[];
  userId: number;
}

export interface LearningPathEntryDTO {
  pathEntryId: number,
  videoId: number,
  videoTitle: string,
  durationSeconds: number,
  questionCount: number,
  entryPosition: number;
}

@Injectable({
  providedIn: 'root'
})
export class LearningPathService {
  http = inject(HttpClient)

  constructor() { }

  getLearningPathDetails(pathId: number){
    return this.http.get<LearningPathDetailDTO>(`${Config.API_URL}/learningpath/${pathId}?userId=${Config.USER_ID}`)
  }

  nextVideoForLearningPath(pathId: number) {
    this.http.post<LearningPathEntryDTO>(`${Config.API_URL}/learningpath/${pathId}/next?userId=${Config.USER_ID}`, {}).subscribe();
  }

  updatePathVisibility(contentId: number, visibility: VisibilityEnum){
    this.http.put(`${Config.API_URL}/learningpath/${contentId}/visibility`, {visibility: visibility}).subscribe()
  }

  updateLearningPath(learningPath: LearningPathDetailDTO){
    console.log("updating learningpath", learningPath)
    return this.http.put<LearningPathDetailDTO>(`${Config.API_URL}/learningpath/`, learningPath)
  }

  createLearningPath(learningPath: LearningPathDetailDTO){
    return this.http.post<LearningPathDetailDTO>(`${Config.API_URL}/learningpath/?userId=${Config.USER_ID}`, learningPath)
  }
}
