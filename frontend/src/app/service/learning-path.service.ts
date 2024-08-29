import {inject, Injectable} from '@angular/core'
import {Tag} from "./tag.service"
import {VideoDetailDTO, ViewProgress, VisibilityEnum} from "./video.service"
import {HttpClient} from "@angular/common/http"
import {Config} from "../config"
import {UserService} from "./user.service"

export interface LearningPathOverviewDTO {
  contentId: number
  title: string
  description: string
  tags: Tag[]
  videoCount: number
  viewProgress: ViewProgress
  color: string
  saved: boolean
}

export interface LearningPathDetailDTO {
  contentId: number
  title: string
  description: string
  tags: Tag[]
  viewProgress?: ViewProgress
  visibility: VisibilityEnum
  color?: string
  entries: LearningPathEntryDTO[]
  userId: number
  approved: boolean
}

export interface LearningPathEntryDTO {
  pathEntryId: number
  videoId: number
  videoTitle: string
  durationSeconds: number
  questionCount: number
  entryPosition: number
  startTime: string
  endTime: string
  progress: number
}

@Injectable({
  providedIn: 'root'
})
export class LearningPathService {
  http = inject(HttpClient)
  userService = inject(UserService)

  constructor() { }

  getLearningPathDetails(pathId: number){
    return this.http.get<LearningPathDetailDTO>(`${Config.API_URL}/learningpath/${pathId}?userId=${this.userService.currentUser.value.userId}`)
  }

  nextVideoForLearningPath(pathId: number) {
    this.http.get<LearningPathEntryDTO>(`${Config.API_URL}/learningpath/${pathId}/next?userId=${this.userService.currentUser.value.userId}`).subscribe();
  }

  updatePathVisibility(contentId: number, visibility: VisibilityEnum){
    this.http.put(`${Config.API_URL}/learningpath/${contentId}/visibility?userId=${this.userService.currentUser.value.userId}`, {visibility: visibility}).subscribe()
  }

  updateLearningPath(learningPath: LearningPathDetailDTO){
    return this.http.put<LearningPathDetailDTO>(`${Config.API_URL}/learningpath?userId=${this.userService.currentUser.value.userId}`, learningPath)
  }

  createLearningPath(learningPath: LearningPathDetailDTO){
    console.log(learningPath)
    return this.http.post<LearningPathDetailDTO>(`${Config.API_URL}/learningpath?userId=${this.userService.currentUser.value.userId}`, learningPath)
  }

  deletePath(learningPathId: number) {
    return this.http.delete(`${Config.API_URL}/learningpath/${learningPathId}`)
  }
}
