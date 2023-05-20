import { ApiProperty } from '@nestjs/swagger';
import { IPagination } from 'src/utils/getPagination';

export interface Bike {
  _id: string;
  name: string;
  cost: number;
  img: string;
  isBooked: boolean;
  // ppecheguzov: не заметил использования поля. а qr код в модалке велосипеда сейчас захардкожен
  code?: string;
}

export class BikeDTO implements Bike {
  _id: string;
  /**
   * @example "Детский велосипед Scool XXlite alloy 20 3-S 2018"
   */
  name: string;
  /**
   * @example 3
   */
  cost: number;
  /**
   * @example b1.png
   */
  img: string;
  /**
   * @example false
   */
  isBooked: boolean;
  code?: string;
}

export class PaginatedBikesDTO implements IPagination<BikeDTO> {
  @ApiProperty({ isArray: true, type: BikeDTO })
  itemsInPage: BikeDTO[];
  /**
   * @example true
   */
  hasMore: boolean;
  /**
   * @example 3
   */
  pages: number;
  /**
   * @example 18
   */
  totalItems: number;
}
