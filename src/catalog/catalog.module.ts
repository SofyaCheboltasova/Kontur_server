import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { BikeModule } from '../bike/bike.module';
import { BikeService } from '../bike/bike.service';
import { PointModule } from '../point/point.module';
import { PointService } from '../point/point.service';
import { OrderService } from 'src/order/order.service';

@Module({
  controllers: [CatalogController],
  imports: [BikeModule, PointModule],
  providers: [BikeService, PointService, OrderService],
})
export class CatalogModule {}
