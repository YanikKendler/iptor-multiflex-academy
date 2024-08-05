export class StarRatingModel {
  private _id: number;
  private _rating: number;

  constructor(id: number, rating: number) {
    this._id = id;
    this._rating = rating;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get rating(): number {
    return this._rating;
  }

  set rating(value: number) {
    this._rating = value;
  }
}
