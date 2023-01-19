import { z } from 'zod';

export const toggleHabitParams = z.object({
  id: z.string().uuid()
});