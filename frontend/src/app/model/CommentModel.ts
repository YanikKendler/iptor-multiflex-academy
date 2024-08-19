export class CommentModel {
  private _id: number;
  private _title: string;
  private _text: string;

  constructor(id: number, title: string, text: string) {
    this._id = id;
    this._title = title;
    this._text = text;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
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
