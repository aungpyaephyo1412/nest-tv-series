import { INestApplication } from '@nestjs/common';
import { ReqLoggingInterceptor } from './interceptors/req-logging.interceptor';
export const appConfig = (_app: INestApplication) => {
  _app.enableCors({
    origin: process.env.FRONTEND_URL as string, // Add your frontend URL here
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
  _app.useGlobalInterceptors(new ReqLoggingInterceptor());
};
