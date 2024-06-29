import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { _swaggerConfig } from '../util';
import { appConfig } from './app.config';
import { AppModule } from './app.module';

const _port = process.env.PORT || 8080;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appConfig(app);
  const document = SwaggerModule.createDocument(app, _swaggerConfig);
  SwaggerModule.setup('', app, document);
  await app.listen(_port);
}
bootstrap();
