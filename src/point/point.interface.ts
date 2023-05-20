export interface Point {
  _id: string;
  address: string;
  bikesList: string[];
  coordinates: number[];
}

export class PointDTO implements Point {
  _id: string;
  /**
   * @example "Плахотного, 9"
   */
  address: string;
  /**
   * список id велосипедов
   * @example ["1m5IBrrls785LLSM", "V1ZztwUkPWIQg2em"]
   */
  bikesList: string[];
  /**
   * @example [54.985851, 82.883644]
   */
  coordinates: number[];
}