import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ErrorResponseService {
  handle(error: any): never {
    console.log(error.code);
    if (error.code === 'P2002') {
      throw new ConflictException({
        [error.meta.target]: `${error.meta.target} is already taken!`,
      });
    }

    if (error.code === 'P2025') {
      throw new NotFoundException({
        message: `${error.meta.target} not found!`,
      });
    }

    throw new InternalServerErrorException({
      [error.meta.target]: error.meta.message,
    });
  }
}

export default ErrorResponseService;
