import { z } from 'zod';

export const getDayParams = z.object({
  date: z.coerce.date()
});