import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { getPagination, IPagination } from '../utils/getPagination';
import { BikeService } from '../bike/bike.service';
import { Bike, BikeDTO, PaginatedBikesDTO } from '../bike/bike.interface';
import { PointService } from '../point/point.service';
import { createReadStream } from 'fs';
import * as path from 'path';
import { OrderService } from '../order/order.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { OperationTags } from 'src/utils/swagger';

@ApiTags(OperationTags.Catalog)
@Controller('api/catalog')
export class CatalogController {
  constructor(
    private ordersService: OrderService,
    private bikeService: BikeService,
    private pointService: PointService,
  ) {}

  private async filterBikesRented(
    userId: string,
    bikes: Bike[],
  ): Promise<Bike[]> {
    const orders = await this.ordersService.getOrders(userId);

    return bikes.filter(
      (bike) => !orders.some(({ bikeId }) => bike._id === bikeId),
    );
  }

  @Get([':pointId?'])
  @ApiOperation({
    summary: 'Получить постранично список велосипедов',
    description:
      'Метод позволяет получить постранично список велосипедов, с фильтрацией по конкретному пункту проката.\n\n' +
      'Метод возвращает общее кол-во страниц, общее кол-во велосипедов и есть ли следущая страница (флаг `hasMore`).\n\n' +
      'На одной странице 6 велосипедов.',
  })
  @ApiParam({
    name: 'pointId',
    required: false,
    description:
      'id пункта проката. Если параметр указан, метод вернёт список велосипедов доступных только в этом пункте проката.',
    schema: {
      type: 'string',
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description:
      'Номер страницы каталога велосипедов. Отсчёт начинается с 1. Если параметр не указан, вернётся 1ая страница.',
    schema: {
      type: 'number',
      example: 1,
    },
  })
  @ApiOkResponse({ type: PaginatedBikesDTO })
  async getList(
    @Res({ passthrough: true }) res: Response,
    @Param('pointId') pointId: string,
    @Query('page') page = 1,
    @Req() req,
  ): Promise<IPagination<Bike>> {
    let list: Bike[] = [];
    if (pointId) {
      const point = await this.pointService.getPoint(pointId);
      if (!point) {
        res.status(HttpStatus.NOT_FOUND).send('Point not found');
        return null;
      }

      list = await this.bikeService.getListByIds(point.bikesList);
    } else {
      list = await this.bikeService.getList();
    }

    if (req.user && req.user._id) {
      list = await this.filterBikesRented(req.user._id, list);
    }

    return getPagination(list, page, 6);
  }

  @Get('/bike/:id')
  @ApiOperation({ summary: 'Получить информацию о велосипеде по id' })
  @ApiOkResponse({ type: BikeDTO })
  async getBike(@Param('id') id: string, @Req() req): Promise<Bike> {
    return this.bikeService.getBikeById(id);
  }

  @Get('/bike/:id/img')
  @ApiOperation({
    summary: 'Скачать картинку велосипеда по id',
    description:
      '**ВНИМАНИЕ: Этот метод не предназначен для вызова через js!**\n\n' +
      'Путь до этого метода нужно подкладывать в html тэг картинки  `<img src="путь до этого метода" />` с помощью ф-ии клиента к апи `api.getBikeImagePath(bike._id)`\n\n' +
      'Браузер сам скачает картинку.',
  })
  @ApiProduces('application/octet-stream')
  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async getImg(
    @Res({ passthrough: true }) res,
    @Param('id') id: string,
  ): Promise<StreamableFile> {
    const bike = await this.bikeService.getBikeById(id);
    const file = createReadStream(path.join(process.cwd(), 'db/img', bike.img));
    return new StreamableFile(file);
  }
}
