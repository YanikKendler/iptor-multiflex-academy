import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import {Tag} from "./tag.service";
import {Comment} from "./comment.service";
import {ContentForUser, User, UserService} from "./user.service";
import {Config} from "../config"
import {LearningPathOverviewDTO} from "./learning-path.service";

export enum VisibilityEnum {
  self="self",everyone="everyone", customers="customers", internal="internal"
}

export interface StarRating {
  ratingId: number;
  rating: number;
}

export interface ViewProgress {
  progressId: number;
  progress: number;
  user: User;
}

export interface VideoFile {
  videoFileId: number;
  durationSeconds?: number;
  sizeBytes?: number;
  originalFileExtension?: string;
  originalFileName?: string;
  timestamp?: string;
}

export interface VideoDetailDTO {
  contentId: number
  title: string
  description: string
  color?: string
  tags: Tag[]
  comments?: Comment[]
  questions?: Question[]
  rating: number
  videoFile?: VideoFile
  viewProgress?: number
  visibility: VisibilityEnum
  userId: number
}

export interface VideoOverviewDTO {
  contentId: number
  title: string
  description: string
  tags: Tag[]
  saved: boolean
  color: string
  durationSeconds: number
  questionCount: number
  viewProgress: ViewProgress
}

export interface VideoAndLearningPathOverviewCollection {
  videos: VideoOverviewDTO[];
  learningPaths: LearningPathOverviewDTO[];
}

export interface QuizResultDTO{
  quizResultId: number;
  selectedAnswers: AnswerOption[];
  score: number;
}

export interface AnswerOption {
  answerOptionId: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  questionId: number;
  answerOptions?: AnswerOption[];
  text: string;
}

export interface ContentOverviewDTO{
  contentId: number;
  title: string;
  type: string;
}

export enum VideoRequestEnum {
  open="open", declined="declined", finished="finished"
}

export interface VideoRequestDetailDTO {
  requestId: number;
  title: string;
  text: string;
  videoId: number
  user: User;
  status: VideoRequestEnum;
}

export interface VideoRequestDTO {
  title: string;
  text: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  http = inject(HttpClient)
  userService = inject(UserService)

  getAll(): Observable<VideoOverviewDTO[]>{
    return this.http.get<VideoOverviewDTO[]>(`${Config.API_URL}/video/`)
  }

  getVideoDetails(videoId: number): Observable<VideoDetailDTO>{
    return this.http.get<VideoDetailDTO>(`${Config.API_URL}/video/${videoId}?userId=${this.userService.currentUser.value.userId}`)
  }

  deleteVideo(videoId: number){
    return this.http.delete(`${Config.API_URL}/video/${videoId}`)
  }

  setStarRating(videoId: number, userId: number, rating: number) {
    return this.http.put(`${Config.API_URL}/video/${videoId}/starrating?userId=${userId}`, rating)
  }

  getStarRating(videoId: number, userId: number): Observable<number>{
    return this.http.get<number>(`${Config.API_URL}/video/${videoId}/starrating/user/${userId}`)
  }

  getRatingAvgByVideo(videoId: number){
    return this.http.get<number>(`${Config.API_URL}/video/${videoId}/starrating/average`)
  }

  createVideo(video: VideoDetailDTO){
    return this.http.post<VideoDetailDTO>(`${Config.API_URL}/video/?userId=${this.userService.currentUser.value.userId}`, video)
  }

  updateVideo(video: VideoDetailDTO){
    return this.http.put<VideoDetailDTO>(`${Config.API_URL}/video/`, video)
  }

  uploadVideoFile(file: File) {
    const fileName = file.name;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<VideoFile>(`${Config.API_URL}/video/videofile?filename=${fileName}`, formData);
  }

  deleteVideoFile(fileId: number) {
    return this.http.delete(`${Config.API_URL}/video/videofile/${fileId}`);
  }

  linkVideoFile(videoId: number, fileId: number) {
    return this.http.put(`${Config.API_URL}/video/${videoId}/linkVideoFile/${fileId}`, {}, {observe: "response"})
  }

  updateVideoVisibility(contentId: number, visibility: VisibilityEnum){
    this.http.put(`${Config.API_URL}/video/${contentId}/visibility`, {visibility: visibility}).subscribe()
  }

  finishQuiz(videoId: number, score: number, selectedAnswers: AnswerOption[]){
    this.http.post(`${Config.API_URL}/video/${videoId}/finishquiz/${score}?userId=${this.userService.currentUser.value.userId}`, selectedAnswers).subscribe();
  }

  getQuizResults(videoId: number){
    return this.http.get<QuizResultDTO>(`${Config.API_URL}/video/${videoId}/quizresults?userId=${this.userService.currentUser.value.userId}`)
  }

  searchContent(elem: string, filterTags: Tag[]) {
    return this.http.post<ContentForUser>(`${Config.API_URL}/content/search?search=${elem}&userId=${this.userService.currentUser.value.userId}`, {tags: filterTags})
  }

  getFullContent() {
    return this.http.get<ContentOverviewDTO[]>(`${Config.API_URL}/content`)
  }

  createVideoRequest(videoRequest: VideoRequestDTO){
    return this.http.post<VideoRequestDTO>(`${Config.API_URL}/video/request`, videoRequest)
  }

  getVideoRequests(){
    return this.http.get<VideoRequestDetailDTO[]>(`${Config.API_URL}/video/request`)
  }

  setVideoRequestStatus(requestId: number, status: VideoRequestEnum, videoId: number){
    if(videoId){
      this.http.put(`${Config.API_URL}/video/request/${requestId}/status/${status}?userId=${this.userService.currentUser.value.userId}&videoId=${videoId}`, {}).subscribe()
    } else{
      this.http.put(`${Config.API_URL}/video/request/${requestId}/status/${status}?userId=${this.userService.currentUser.value.userId}&videoId=0`, {}).subscribe()
    }
  }
}
