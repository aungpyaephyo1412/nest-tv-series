import { z } from 'zod';

export const LoginAuthSchema = z
  .object({
    identifier: z
      .string({ message: 'Email is required' })
      .email({ message: 'Email is not invalid' }),
    password: z
      .string({ message: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(100, { message: 'Password must be at most 100 characters' }),
  })
  .required();

export type LoginAuthDto = z.infer<typeof LoginAuthSchema>;
