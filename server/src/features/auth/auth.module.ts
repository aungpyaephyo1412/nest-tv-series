import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { MailModule } from '../../mail/mail.module';
import { DtoTransformerService } from '../../util/dto-transformer.service';
import ErrorResponseService from '../../util/error-response.service';
import { PasswordService } from '../../util/password.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    ErrorResponseService,
    DtoTransformerService,
  ],
})
export class AuthModule {}
