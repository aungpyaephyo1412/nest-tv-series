import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { DtoTransformerService } from '../../util/dto-transformer.service';
import ErrorResponseService from '../../util/error-response.service';
import { Public } from '../auth/decorators/public.decorator';
import { FileService } from '../file/file.service';
import { FileSizeValidatorPipe } from '../file/pipes/file-size-validator.pipe';
import { FileTypeValidatorPipe } from '../file/pipes/file-type-validator.pipe';
import {
  patchUserDto,
  PatchUserDto,
  patchUserDtoSchema,
  PutUserDto,
  putUserDtoSchema,
} from './dto/update-user.dto';
import { userDtoSchema } from './dto/user.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { usersDtoSchema } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileService: FileService,
    private readonly dtoTransformer: DtoTransformerService,
    private readonly errorResponse: ErrorResponseService,
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
    const user = await this.usersService.findOne({ where: { id } });
    return {
      data: this.dtoTransformer.transform(userDtoSchema, user),
    };
  }

  @Put(':id')
  async put(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(putUserDtoSchema)) putDto: PutUserDto,
  ) {
    const user = await this.usersService.update({
      where: { id },
      data: putDto,
    });
    return {
      message: 'User updated successfully',
      data: this.dtoTransformer.transform(userDtoSchema, user),
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async patch(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(patchUserDtoSchema)) patch: PatchUserDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidatorPipe({
            fileType: ['image/jpeg', 'image/jpg', 'image/png'],
          }),
          new FileSizeValidatorPipe({ fileSize: 5000000 }),
        ],
      }),
    )
    avatar?: Express.Multer.File,
  ) {
    try {
      const user = await this.usersService.findOne({ where: { id } });
      const body = new patchUserDto();
      if (avatar) {
        if (user.avatar) {
          await this.fileService.delete({
            bucket: 'nest',
            path: user.avatar,
          });
        }
        const fileUrl = await this.fileService.upload({
          file: avatar,
          bucket: 'nest',
          path: 'avatars',
        });
        if (fileUrl) body.avatar = fileUrl;
      }
      ['name', 'username', 'address', 'dateOfBirth'].forEach((key) => {
        if (patch[key]) {
          body[key] = patch[key];
        }
      });
      const res = await this.usersService.update({
        where: { id },
        data: body,
      });
      return {
        message: 'User updated successfully',
        data: this.dtoTransformer.transform(userDtoSchema, res),
      };
    } catch (e) {
      this.errorResponse.handle(e);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
