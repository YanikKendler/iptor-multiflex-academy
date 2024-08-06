export class AnswerOptionModel {
  private _id: number;
  private _text: string;
  private _isCorrect: boolean;

  constructor(id: number, text: string, isCorrect: boolean) {
    this._id = id;
    this._text = text;
    this._isCorrect = isCorrect;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
  }

  get isCorrect(): boolean {
    return this._isCorrect;
  }

  set isCorrect(value: boolean) {
    this._isCorrect = value;
  }
}
