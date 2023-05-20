import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersCurrentController } from './users/users-current.controller';
import { CatalogModule } from './catalog/catalog.module';
import { BikeModule } from './bike/bike.module';
import { PointModule } from './point/point.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CatalogModule,
    BikeModule,
    PointModule,
    OrderModule,
  ],
  controllers: [AppController, UsersCurrentController],
  providers: [AppService],
})
export class AppModule {}
