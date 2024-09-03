import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Config} from "../config"
import {UserService} from "./user.service"

export interface Tag {
  tagId: number
  name: string
}


@Injectable({
  providedIn: 'root'
})
export class TagService {
  http = inject(HttpClient)
  userService = inject(UserService)

  getAll(){
    return this.http.get<Tag[]>(`${Config.API_URL}/tag/`)
  }

  createTag(name: string) {
    return this.http.post<Tag>(`${Config.API_URL}/tag`, {name: name})
  }

  deleteTag(tagId: number){
    return this.http.delete(`${Config.API_URL}/tag/${tagId}`)
  }
}
