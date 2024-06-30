import { z } from 'zod';

export const userDtoSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1),
  username: z.string().min(1),
  address: z.string().nullish(),
  dateOfBirth: z.coerce.date().nullish(),
  isVerified: z.boolean(),
  isBlocked: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserDto = z.infer<typeof userDtoSchema>;
