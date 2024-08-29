import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {VideoAndLearningPathOverviewCollection, VisibilityEnum} from "./video.service";
import {Config} from "../config"
import {Tag} from "./tag.service";
import {BehaviorSubject, Observable, Subject} from "rxjs"

export interface User {
  userId: number
  username: string
  email: string
  password: string
  userRole: UserRoleEnum
  supervisor: number
  deputySupervisor: number
}

export enum UserRoleEnum{
  ADMIN="ADMIN", EMPLOYEE="EMPLOYEE", CUSTOMER="CUSTOMER"
}

export interface ContentForUser {
  current: VideoAndLearningPathOverviewCollection;
  assigned: VideoAndLearningPathOverviewCollection;
  suggested: VideoAndLearningPathOverviewCollection
}

export interface MyVideoDTO {
  contentId: number,
  title: String,
  views: number,
  rating: number,
  visibility: VisibilityEnum,
  questionCount: number,
  tags: Tag[],
  color: String,
  approved: boolean
}

export interface MyLearningpathDTO {
  contentId: number
  title: String
  views: number
  visibility: VisibilityEnum
  videoCount: number
  tags: Tag[]
  color: String,
  approved: boolean
}

export interface UserDTO{
  username: string
  email: string
  password: string
  userRole: string
}

export interface UserLoginDTO{
  userId: number
  password: string
}

export interface UserAssignedContentDTO {
  contentId: number
  title: string
  type: string
  progress: number
  questionOrVideoCount: number,
  color: string,
  isFinished: boolean
}

export interface UserTreeDTO{
  userId: number
  username: string
  level: number
  subordinates: UserTreeDTO[]
}

export enum ContentEditType{
  tags="tags", title="title", description="description", color="color",
  visibility="visibility", entries="entries", questions="questions", videoFile="videoFile"
}

export interface ContentEditHistoryDTO{
  user: User
  type: ContentEditType
  timestamp: string
}

export interface UserStatisticsDTO{
  user: User
  totalCommentsLeft: number
  totalVideosRated: number
  averageStarRatingGiven: number
  quizzesCompleted: number
  totalVideosWatched: number
  totalLearningPathsCompleted: number
  totalContentSaved: number
  totalVideosUploaded: number
  totalLearningPathsUploaded: number
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient)

  //i have no idea if this is a sin in angular development
  //also its probably bad to give out the password has just like that :shrug:
  currentUser = new BehaviorSubject<User>({userId: -1} as User)

  getById(userId: number){
    return this.http.get<User>(`${Config.API_URL}/user/${userId}`)
  }

  toggleSavedContent(contentId: number){
    return this.http.put(`${Config.API_URL}/user/${this.currentUser.value.userId}/togglesavedcontent/${contentId}`, {}).subscribe()
  }

  isVideoSaved(videoId: number){
    return this.http.get<boolean>(`${Config.API_URL}/user/${this.currentUser.value.userId}/isvideosaved/${videoId}`)
  }

  getContentForUser(filterTags: Tag[]){
    return this.http.post<ContentForUser>(`${Config.API_URL}/user/${this.currentUser.value.userId}/contentforuser`, {tags: filterTags})
  }

  getUserVideos(){
    return this.http.get<MyVideoDTO[]>(`${Config.API_URL}/user/${this.currentUser.value.userId}/videos`)
  }

  getUserLearningpaths(){
    return this.http.get<MyLearningpathDTO[]>(`${Config.API_URL}/user/${this.currentUser.value.userId}/learningpaths`)
  }

  createUser(userDTO: UserDTO){
    return this.http.post<User>(`${Config.API_URL}/user`, userDTO)
  }

  login(userDTO: UserDTO) {
    return this.http.post<User>(`${Config.API_URL}/user/login`, {email: userDTO.email, password: userDTO.password})
  }

  isLoggedIn(user: UserLoginDTO) {
    return this.http.post<User>(`${Config.API_URL}/user/isloggedin`, user)
  }

  getManageableUsers() {
    return this.http.get<UserTreeDTO>(`${Config.API_URL}/user/${this.currentUser.value.userId}/getusers`)
  }

  getAssignedUserContent(userId: number){
    return this.http.get<UserAssignedContentDTO[]>(`${Config.API_URL}/user/${userId}/assignedcontent`)
  }

  assignContent(userId: number, contentId: number) {
    return this.http.post<UserAssignedContentDTO>(`${Config.API_URL}/user/${this.currentUser.value.userId}/assigncontent/${contentId}?assignTo=${userId}`, {})
  }

  unassignContent(userId: number, contentId: number) {
    return this.http.delete(`${Config.API_URL}/user/${userId}/unassigncontent/${contentId}`).subscribe()
  }

  finishAssignedContent(contentId: number) {
    return this.http.put(`${Config.API_URL}/user/${this.currentUser.value.userId}/finishassignedcontent/${contentId}`, {})
  }

  approveContent(contentId: number){
    return this.http.put(`${Config.API_URL}/content/${contentId}/approve?userId=${this.currentUser.value.userId}`, {})
  }

  isUserAllowedToSeeContent(contentId: number) {
    return this.http.get(`${Config.API_URL}/user/${this.currentUser.value.userId}/isallowed/${contentId}`)
  }

  getContentHistory(contentId: number){
    return this.http.get<ContentEditHistoryDTO[]>(`${Config.API_URL}/content/${contentId}/history`)
  }

  getUserStatistics(userId: number){
    return this.http.get<UserStatisticsDTO>(`${Config.API_URL}/user/${userId}/statistics`)
  }
}
