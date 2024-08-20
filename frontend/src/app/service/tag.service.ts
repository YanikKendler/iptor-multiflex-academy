import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Config} from "../config"

export interface Tag {
  tagId: number
  name: string
}


@Injectable({
  providedIn: 'root'
})
export class TagService {
  http = inject(HttpClient)

  getAll(){
    return this.http.get<Tag[]>(`${Config.API_URL}/tag/`)
  }

  createTag(name: string) {
    return this.http.post<Tag>(`${Config.API_URL}/tag`, {name: name})
  }
}
