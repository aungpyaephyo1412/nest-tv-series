import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { appConfig } from './app.config';
import { AppModule } from './app.module';

const _port = process.env.PORT || 8080;
(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appConfig(app);
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Nest Documentation')
      .setDescription('')
      .setVersion('1.0')
      .addTag('nest-test')
      .build(),
  );
  SwaggerModule.setup('', app, document);
  await app.listen(_port);
})();
