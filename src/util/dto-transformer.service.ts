import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { z, ZodSchema } from 'zod';

@Injectable()
export class DtoTransformerService {
  transform<T extends ZodSchema<any>>(schema: T, data: any): z.TypeOf<T> {
    const validationResult = schema.safeParse(data);

    if (!validationResult.success) {
      console.log(validationResult.error.format());
      throw new InternalServerErrorException({
        message: 'Type error | type validation failed',
        errors: validationResult.error.format(),
      });
    }

    return validationResult.data;
  }
}
