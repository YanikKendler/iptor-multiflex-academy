import { Injectable } from '@angular/core';
import {Tag} from "./tag.service";
import {ViewProgress} from "./video.service";

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

@Injectable({
  providedIn: 'root'
})
export class LearningPathService {

  constructor() { }
}
