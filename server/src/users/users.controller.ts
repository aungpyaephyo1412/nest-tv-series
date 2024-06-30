import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { Public } from '../auth/decorators/is-public.decorator';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { DtoTransformerService } from '../util/dto-transformer.service';
import {
  patchUserDto,
  PatchUserDto,
  patchUserDtoSchema,
  PutUserDto,
  putUserDtoSchema,
} from './dto/update-user.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { usersDtoSchema } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly dtoTransformer: DtoTransformerService,
  ) {}

  @Public()
  @Get()
  async findAll(@Query() query: UsersQueryDto) {
    const { q, page = 1, perPage = 50, sort } = query;
    const users = await this.usersService.findAll({
      page: page,
      perPage: perPage,
      ...(sort && { orderBy: sort }),
      where: {
        ...(q && {
          OR: [
            {
              name: {
                contains: q,
                mode: 'insensitive',
              },
            },
            {
              username: {
                contains: q,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },
    });
    return this.dtoTransformer.transform(usersDtoSchema, users);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne({ where: { id } });
  }

  @Put(':id')
  async put(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(putUserDtoSchema)) putDto: PutUserDto,
  ) {
    return await this.usersService.update({
      where: { id },
      data: putDto,
    });
  }

  @Patch(':id')
  async patch(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(patchUserDtoSchema)) patchDto: PatchUserDto,
  ) {
    const userDto = new patchUserDto();
    ['name', 'username', 'address', 'dateOfBirth'].forEach((key) => {
      if (patchDto[key]) {
        userDto[key] = patchDto[key];
      }
    });
    return await this.usersService.update({
      where: { id },
      data: userDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
