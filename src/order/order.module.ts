import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PointService } from '../point/point.service';

@Module({
  providers: [OrderService, PointService],
  controllers: [OrderController],
})
export class OrderModule {}
