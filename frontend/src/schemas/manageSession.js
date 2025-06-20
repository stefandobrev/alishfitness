import { z } from 'zod';

export const manageSession = z.object({
  session: z.array(
    z.object({
      exerciseId: z.number(),
      sets: z.array(
        z.object({
          weight: z.number().nonnegative().optional(),
          reps: z.number().int().nonnegative().optional(),
        }),
      ),
    }),
  ),
});
