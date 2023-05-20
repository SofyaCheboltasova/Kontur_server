import { Controller, Get, Param } from '@nestjs/common';
import { PointService } from './point.service';
import { Point, PointDTO } from './point.interface';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OperationTags } from 'src/utils/swagger';

@ApiTags(OperationTags.Points)
@Controller('api/point')
export class PointController {
  constructor(private pointService: PointService) {}

  @ApiOperation({ summary: 'Получить список пунктов проката' })
  @ApiOkResponse({ type: PointDTO, isArray: true })
  @Get('/')
  async getList(): Promise<Point[]> {
    return await this.pointService.getList();
  }

  @ApiOperation({ summary: 'Получить информацию о пункте проката по id' })
  @ApiOkResponse({ type: PointDTO })
  @Get([':pointId?'])
  async getPoint(@Param('pointId') pointId: string): Promise<Point> {
    return await this.pointService.getPoint(pointId);
  }
}
