import { z } from 'zod';
import { userDtoSchema } from './user.dto';

export const usersDtoSchema = z.object({
  data: z.array(userDtoSchema),
  meta: z.object({
    total: z.number(),
    lastPage: z.number(),
    currentPage: z.number(),
    perPage: z.number(),
    prev: z.number().nullish(),
    next: z.number().nullish(),
  }),
});
