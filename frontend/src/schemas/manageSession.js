import { z } from 'zod';

export const manageSession = z.object({
  setLogs: z.record(
    z.string(), // Outer string - sequence
    z.object({
      sets: z.record(
        z.string(), // Inner string - set numbers
        z.object({
          id: z.number(),
          weight: z.number().nonnegative().nullable(),
          reps: z.number().int().nonnegative().nullable(),
        }),
      ),
    }),
  ),
});
