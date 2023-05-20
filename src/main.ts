import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { OperationTags } from './utils/swagger';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('АПИ сервиса аренды велосипедов')
    .addCookieAuth('connect.sid')
    .setVersion('1.0')
    .addTag(OperationTags.User)
    .addTag(OperationTags.Catalog)
    .addTag(OperationTags.Points)
    .addTag(OperationTags.Orders)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(
    session({
      secret: 'some-super-secret-key-123',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3010);
}
bootstrap();
