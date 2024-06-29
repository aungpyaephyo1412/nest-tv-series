import { z } from 'zod';

export const AuthDtoSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1),
  username: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AuthDto = z.infer<typeof AuthDtoSchema>;
