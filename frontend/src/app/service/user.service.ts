import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {VideoAndLearningPathOverviewCollection, VisibilityEnum} from "./video.service";
import {Config} from "../config"
import {Tag} from "./tag.service";

export interface User {
  userId: number;
  username: string;
  email: string;
}

export enum UserEnum{
  ADMIN="admin", EMPLOYEE="employee", CUSTOMER="customer"
}

export interface ContentForUser {
  current: VideoAndLearningPathOverviewCollection;
  assigned: VideoAndLearningPathOverviewCollection;
  suggested: VideoAndLearningPathOverviewCollection
}

export interface MyLearningpathDTO {
  contentId: number,
  title: String,
  views: number,
  rating: number,
  visibility: VisibilityEnum,
  questionCount: number,
  tags: Tag[],
  color: String
}

export interface MyLearningpathDTO {
  contentId: number,
  title: String,
  views: number,
  visibility: VisibilityEnum,
  videoCount: number,
  tags: Tag[],
  color: String
}

export interface UserDTO{
  username: string,
  email: string,
  password: string,
  userType: string
}

export interface UserLoginDTO{
  userId: number,
  password: string
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient)

  constructor() { }

  toggleSavedContent(contentId: number){
    return this.http.put(`${Config.API_URL}/user/${Config.USER_ID}/togglesavedcontent/${contentId}`, {}).subscribe()
  }

  isVideoSaved(videoId: number){
    return this.http.get<boolean>(`${Config.API_URL}/user/${Config.USER_ID}/isvideosaved/${videoId}`)
  }

  getContentForUser(filterTags: Tag[]){
    return this.http.post<ContentForUser>(`${Config.API_URL}/user/${Config.USER_ID}/contentforuser`, {tags: filterTags})
  }

  getUserVideos(){
    return this.http.get<MyLearningpathDTO[]>(`${Config.API_URL}/user/${Config.USER_ID}/videos`)
  }

  getUserLearningpaths(){
    return this.http.get<MyLearningpathDTO[]>(`${Config.API_URL}/user/${Config.USER_ID}/learningpaths`)
  }

  createUser(userDTO: UserDTO){
    console.log(userDTO)
    return this.http.post<number>(`${Config.API_URL}/user`, userDTO)
  }

  login(userDTO: UserDTO) {
    return this.http.post<number>(`${Config.API_URL}/user/login`, {email: userDTO.email, password: userDTO.password})
  }

  isLoggedIn(user: UserLoginDTO) {
    return this.http.post<boolean>(`${Config.API_URL}/user/isloggedin`, user)
  }
}
