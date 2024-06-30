import { z } from 'zod';

export const putUserDtoSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  dateOfBirth: z.coerce.date(),
});

export type PutUserDto = z.infer<typeof putUserDtoSchema>;

export const patchUserDtoSchema = z.object({
  name: z.string().nullish(),
  username: z.string().nullish(),
  address: z.string().nullish(),
  dateOfBirth: z.coerce.date().nullish(),
});

export type PatchUserDto = z.infer<typeof patchUserDtoSchema>;

export class patchUserDto {
  name?: string;
  username?: string;
  password?: string;
  address?: string;
  dateOfBirth?: Date;
}
