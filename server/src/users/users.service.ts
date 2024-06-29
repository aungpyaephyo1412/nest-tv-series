import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { PrismaService } from '../database/prisma/prisma.service';
import { PaginatedOutputDto } from '../pagination/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAuthDto: CreateAuthDto): Promise<User> {
    return this.prismaService.user.create({
      data: createAuthDto,
    });
  }

  async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async findAll(params: {
    page?: number;
    perPage?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<PaginatedOutputDto<CreateUserDto>> {
    const { page = 1, perPage = 50, where, orderBy } = params;
    const paginate = createPaginator({ perPage });
    return paginate<User, Prisma.UserFindManyArgs>(
      this.prismaService.user,
      {
        ...(where && { where }),
        ...(orderBy && { orderBy }),
      },
      {
        page,
      },
    );
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prismaService.user.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.delete({
      where,
    });
  }
}
