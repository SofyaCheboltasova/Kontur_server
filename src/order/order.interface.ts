import { PickType } from '@nestjs/swagger';

export interface Order {
  _id?: string;
  userId: string;
  bikeId: string;
  pointId: string;
  start?: string;
  end?: string;
}
export type CreateOrderRequest = Pick<Order, 'bikeId'>;
export interface DeleteOrderRequest {
  orderId: string;
}
export interface QrCode {
  code: string;
}
export interface RentSuccessResponse {
  success: boolean;
}

export class OrderDTO implements Order {
  _id?: string;
  userId: string;
  /**
   * @example 1m5IBrrls785LLSM
   */
  bikeId: string;
  /**
   * @example MHYrbJIhDVDA66Pu
   */
  pointId: string;
  /**
   * @example "2022-11-17T13:21:59.683Z"
   */
  start?: string;
  /**
   * @example "2022-11-17T13:23:32.777Z"
   */
  end?: string;
}

export class CreateOrderRequestDTO
  extends PickType(OrderDTO, ['bikeId'])
  implements CreateOrderRequest {}

export class DeleteOrderRequrestDTO implements DeleteOrderRequest {
  orderId: string;
}

export class QrCodeDTO implements QrCode {
  /** Изображение QR кода закодировано в строку как (Data URL)[https://developer.mozilla.org/ru/docs/Web/HTTP/Basics_of_HTTP/Data_URLs]
   *
   * Вставьте полученную строку в тэг картинки как
   * ```
   * <img src=`${code}` />
   * ```
   *
   * @example "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJw..."
   */
  code: string;
}

export class RentSuccessResponseDTO implements RentSuccessResponse {
  /**
   * @example true
   */
  success: boolean;
}
