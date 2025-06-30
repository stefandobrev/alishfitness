import { z } from 'zod';

// Validates and transforms text to dec/int
export const manageSession = z.object({
  setLogs: z.record(
    z.string(), // Outer string - sequence
    z.object({
      sets: z.record(
        z.string(), // Inner string - set numbers
        z.object({
          id: z.number(),
          weight: z
            .union([
              z
                .string()
                .regex(/^\d*\.?\d*$/)
                .transform((val) => (val === '' ? null : parseFloat(val))),
              z.number(),
              z.null(),
            ])
            .nullable(),

          reps: z
            .union([
              z
                .string()
                .regex(/^\d+$/)
                .transform((val) => (val === '' ? null : parseInt(val, 10))),
              z.number().int(),
              z.null(),
            ])
            .nullable(),
        }),
      ),
    }),
  ),
});
