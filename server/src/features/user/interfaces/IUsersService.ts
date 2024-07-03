import { Prisma, User } from '@prisma/client';
import { PaginatedOutputDto } from '../../../pagination/pagination.dto';

export interface FindAllUsersParams {
  page?: number;
  perPage?: number;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
}
export interface FindOneUserParams {
  where: Prisma.UserWhereUniqueInput;
}
export interface UpdateUserParams {
  where: Prisma.UserWhereUniqueInput;
  data: Prisma.UserUpdateInput;
}
export interface DeleteUserParams {
  where: Prisma.UserWhereUniqueInput;
}
export interface IUsersService {
  findAll(params: FindAllUsersParams): Promise<PaginatedOutputDto<User>>;
  findOne(params: FindOneUserParams): Promise<User | null>;
  update(params: UpdateUserParams): Promise<User | null>;
  delete(params: DeleteUserParams): Promise<User | null>;
}
