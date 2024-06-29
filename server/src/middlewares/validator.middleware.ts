import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class requestValidator implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metadata: ArgumentMetadata) {
    const validateFields = this.schema.safeParse(value);
    if (validateFields.success) {
      return validateFields.data;
    }
    throw new BadRequestException(validateFields.error.flatten().fieldErrors);
  }
}
