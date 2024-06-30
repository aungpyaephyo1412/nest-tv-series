import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { DtoTransformerService } from '../util/dto-transformer.service';
import ErrorResponseService from '../util/error-response.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, ErrorResponseService, DtoTransformerService],
})
export class UsersModule {}
