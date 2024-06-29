import { INestApplication } from '@nestjs/common';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

export const appConfig = (_app: INestApplication) => {
  _app.enableCors({
    origin: 'http://localhost:5173', // Add your frontend URL here
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  });
  _app.setGlobalPrefix('api/v1');
  _app.useGlobalInterceptors(new LoggingInterceptor());
};
