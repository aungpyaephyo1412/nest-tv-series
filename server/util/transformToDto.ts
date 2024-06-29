// utils/dto-transformer.util.ts
import { z, ZodSchema } from 'zod';

export function transformToDto<T extends ZodSchema<any>>(
  Schema: T,
  data: any,
): z.TypeOf<T> {
  const validateFields = Schema.safeParse(data);
  if (!validateFields.success) return null;
  return validateFields.data;
}
