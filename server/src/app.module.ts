import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma/prisma.module';
import { AuthModule } from './features/auth/auth.module';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { RolesGuard } from './features/auth/guards/roles.guard';
import { FileModule } from './features/file/file.module';
import { UsersModule } from './features/user/users.module';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { PasswordService } from './util/password.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_SECRET as string,
      signOptions: { expiresIn: process.env.JWT_AGE as string },
    }),
    MailerModule.forRoot({
      transport: {
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 sec
        limit: 5,
      },
      {
        name: 'medium',
        ttl: 10000, // 10 sec
        limit: 5,
      },
      {
        name: 'long',
        ttl: 60000, // 1 min
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    PasswordService,
    MailService,
  ],
})
export class AppModule {}

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply().forRoutes('*');
//   }
// }
