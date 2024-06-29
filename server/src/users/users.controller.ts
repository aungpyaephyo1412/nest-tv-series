import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { UsersQueryDto } from './dto/users-query.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: UsersQueryDto) {
    const { q, page = 1, perPage = 50, sort } = query;
    return this.usersService.findAll({
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
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id });
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   // return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete({ id });
  }
}
