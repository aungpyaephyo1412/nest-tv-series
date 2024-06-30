import { z } from 'zod';

export const CreateAuthSchema = z
  .object({
    name: z
      .string({ message: 'Name is required' })
      .min(1, { message: 'Name must be at least 1 character' })
      .max(100, { message: 'Name must be at least 100 characters' }),
    email: z
      .string({ message: 'Email is required' })
      .email({ message: 'Email is not invalid' }),
    password: z
      .string({ message: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(100, { message: 'Password must be at most 100 characters' }),
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < password.length; i++) {
      const ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      checkPassComplexity.addIssue({
        path: ['password'],
        code: 'custom',
        message:
          'Password must be contain lowercase characters,uppercase characters,special characters and numbers',
      });
    }
  });

export type RegisterDto = z.infer<typeof CreateAuthSchema>;
