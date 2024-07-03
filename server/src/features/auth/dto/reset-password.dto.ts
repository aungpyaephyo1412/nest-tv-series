import { z } from 'zod';

export const resetPasswordDtoSchema = z.object({
  email: z.string().email(),
  resetToken: z.string().min(2),
  password: z.string().min(3),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordDtoSchema>;
