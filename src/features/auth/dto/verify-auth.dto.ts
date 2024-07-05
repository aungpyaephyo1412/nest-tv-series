import { z } from 'zod';

export const verifyAuthDtoSchema = z.object({
  email: z.string().min(1),
  token: z.string().min(1),
});

export type VerifyAuthDto = z.infer<typeof verifyAuthDtoSchema>;
