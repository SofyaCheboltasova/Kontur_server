import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { PointService } from '../point/point.service';
import { toDataURL } from 'qrcode';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { OperationTags } from 'src/utils/swagger';
import {
  CreateOrderRequest,
  CreateOrderRequestDTO,
  DeleteOrderRequest,
  DeleteOrderRequrestDTO,
  Order,
  OrderDTO,
  QrCode,
  QrCodeDTO,
  RentSuccessResponse,
  RentSuccessResponseDTO,
} from './order.interface';

@UseGuards(AuthenticatedGuard)
@Controller('api/order')
@ApiTags(OperationTags.Orders)
export class OrderController {
  constructor(
    private orderService: OrderService,
    private pointService: PointService,
  ) {}

  private async createQRCode(orderId: string) {
    return toDataURL(`http://localhost:3000/books/${orderId}?action=start`, {
      margin: 0,
      width: 156,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Получить список бронирований' })
  @ApiOkResponse({ type: OrderDTO, isArray: true })
  async getOrders(@Req() req): Promise<Order[]> {
    return this.orderService.getOrders(req.user._id);
  }

  @Get('/get-completed-orders')
  @ApiOperation({ summary: 'Получть список законченных бронирований' })
  @ApiOkResponse({ type: OrderDTO, isArray: true })
  async getCompletedOrders(@Req() req): Promise<Order[]> {
    return this.orderService.getCompletedOrders(req.user._id);
  }

  @Get('/rent')
  @ApiOperation({ summary: 'Начать аренду велосипеда по id бронирования' })
  @ApiOkResponse({ type: RentSuccessResponseDTO })
  async rent(@Query('orderId') orderId: string, @Req() req) {
    const foundedOrder = await this.orderService.getOrder(orderId);

    if (foundedOrder?.start) {
      throw new ConflictException('Аренда уже начата');
    }

    this.orderService.rent(req.user._id, orderId);

    return { success: true };
  }

  @Get('/stop-rent')
  @ApiOperation({ summary: 'Закончить аренду велосипеда по id бронирования' })
  @ApiOkResponse({ type: RentSuccessResponseDTO })
  async stopRent(
    @Query('orderId') orderId: string,
    @Req() req,
  ): Promise<RentSuccessResponse> {
    const foundedOrder = await this.orderService.getOrder(orderId);

    if (foundedOrder?.end) {
      throw new ConflictException('Аренда уже закончена');
    }

    await this.orderService.stopRent(req.user._id, orderId);

    return { success: true };
  }

  // ppecheguzov: сейчас qr код нигде в базы данных не сохраняется, в модель Bike не подставляется
  @Get('/get-qrcode')
  @ApiOperation({
    summary: 'Получить qr код бронирования по id',
    description:
      'Изображение QR кода закодировано в строку как ' +
      '[Data URL](https://developer.mozilla.org/ru/docs/Web/HTTP/Basics_of_HTTP/Data_URLs)\n\n' +
      'Вставьте полученную строку в тэг картинки как\n' +
      '```\n<img src=`${code}` />\n```',
  })
  @ApiOkResponse({ type: QrCodeDTO })
  async getQRCode(
    @Query('orderId') orderId: string,
    @Req() req,
  ): Promise<QrCode> {
    const code = await this.createQRCode(orderId);

    return { code };
  }

  @Get('/:orderId')
  @ApiOperation({ summary: 'Получить информацию о бронировании по id' })
  @ApiOkResponse({ type: OrderDTO })
  async getOrder(@Param('orderId') orderId: string): Promise<Order> {
    return this.orderService.getOrder(orderId);
  }

  @Post()
  @ApiOperation({ summary: 'Создать бронирование по id велосипеда' })
  @ApiBody({ type: CreateOrderRequestDTO })
  @ApiCreatedResponse({ type: OrderDTO })
  async createOrder(
    @Body() { bikeId }: CreateOrderRequest,
    @Req() req,
  ): Promise<Order> {
    const res = await this.pointService.getBikePoint(bikeId);

    //todo mark bike as rented
    return this.orderService.create(req.user._id, bikeId, res._id);
  }

  @Delete()
  @ApiOperation({ summary: 'Удалить бронирование по id' })
  @ApiBody({ type: DeleteOrderRequrestDTO })
  @ApiOkResponse()
  async deleteOrder(@Body() { orderId }: DeleteOrderRequest) {
    //todo remove bike rented mark
    return this.orderService.deleteOrder(orderId);
  }
}
