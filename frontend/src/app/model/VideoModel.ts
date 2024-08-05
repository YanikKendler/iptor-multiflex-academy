import {TagModel} from "./TagModel";
import {CommentModel} from "./CommentModel";
import {QuestionModel} from "./QuestionModel";
import {StarRatingModel} from "./StarRatingModel";

export enum VisibilityEnum {
  self,everyone, customers, internal
}

export interface VideoOverview {
  videoId: number;
  title: string;
  description: string;
  tags: TagModel[];
  saved: boolean;
  color: string;
}

export class VideoModel {
  private _videoId: number;
  private _title: string;
  private _description: string;
  private _saved: boolean;
  private _tags: TagModel[];
  private _comments: CommentModel[];
  private _questions: QuestionModel[];
  private _starRatings: StarRatingModel[];
  private _color: string;
  private _visibility: VisibilityEnum;

  constructor(id: number, tags: TagModel[], comments: CommentModel[], questions: QuestionModel[], starRatings: StarRatingModel[], title: string, description: string, saved: boolean, color: string, visibility: VisibilityEnum, requestVideo: boolean) {
    this._videoId = id;
    this._tags = tags;
    this._comments = comments;
    this._questions = questions;
    this._starRatings = starRatings;
    this._title = title;
    this._description = description;
    this._saved = saved;
    this._color = color;
    this._visibility = visibility;
  }

  get videoId(): number {
    return this._videoId;
  }

  set videoId(value: number) {
    this._videoId = value;
  }

  get tags(): TagModel[] {
    return this._tags;
  }

  set tags(value: TagModel[]) {
    this._tags = value;
  }

  get comments(): CommentModel[] {
    return this._comments;
  }

  set comments(value: CommentModel[]) {
    this._comments = value;
  }

  get questions(): QuestionModel[] {
    return this._questions;
  }

  set questions(value: QuestionModel[]) {
    this._questions = value;
  }

  get starRatings(): StarRatingModel[] {
    return this._starRatings;
  }

  set starRatings(value: StarRatingModel[]) {
    this._starRatings = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get saved(): boolean {
    return this._saved;
  }

  set saved(value: boolean) {
    this._saved = value;
  }

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }

  get visibility(): VisibilityEnum {
    return this._visibility;
  }

  set visibility(value: VisibilityEnum) {
    this._visibility = value;
  }
}
