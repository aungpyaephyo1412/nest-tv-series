import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { PrismaModule } from './database/prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { UsersModule } from './users/users.module';
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
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
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
