import { Module } from '@nestjs/common';
import { BikeService } from './bike.service';

@Module({
  providers: [BikeService],
})
export class BikeModule {}
