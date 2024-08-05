import {AnswerOptionModel} from "./AnswerOptionModel";

export class QuestionModel {
  private _id: number;
  private _answerOptions: AnswerOptionModel[];
  private _title: string;
  private _text: string;

  constructor(id: number, answerOptions: AnswerOptionModel[], title: string, text: string) {
    this._id = id;
    this._answerOptions = answerOptions;
    this._title = title;
    this._text = text;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get answerOptions(): AnswerOptionModel[] {
    return this._answerOptions;
  }

  set answerOptions(value: AnswerOptionModel[]) {
    this._answerOptions = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
  }
}
