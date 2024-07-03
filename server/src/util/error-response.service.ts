import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ErrorResponseService {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger('ErrorResponseService');
  }
  handle(error: any): never {
    this.logger.error(error);
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
      error,
    });
  }
}

export default ErrorResponseService;
