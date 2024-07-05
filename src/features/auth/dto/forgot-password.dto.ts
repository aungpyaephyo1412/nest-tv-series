import { z } from 'zod';

export const forgotPasswordDtoSchema = z.object({
  identifier: z.string().email(),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordDtoSchema>;
