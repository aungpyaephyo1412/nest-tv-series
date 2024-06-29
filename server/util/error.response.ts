import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

const _errorResponse = (error: any) => {
  // other error handling logic here
  if (error.code === 'P2002')
    throw new ConflictException({
      [error.meta.target]: `${error.meta.target} is already taken!`,
    });

  if (error.code === 'P2025')
    throw new BadRequestException({
      message: `No item found with provided related code. Please make sure your related item's code is valid  `,
    });
  // this is default error response, if nothing above match
  throw new InternalServerErrorException();
};

export default _errorResponse;
