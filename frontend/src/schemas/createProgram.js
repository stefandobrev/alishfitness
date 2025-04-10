import { z } from 'zod';

const sessionSchema = z
  .object({
    title: z.string().min(1, 'Session title is required.'),
    exercises: z.array(
      z.object({
        sequence: z.string().min(1, 'Sequence is required.'),
      }),
    ),
  })
  .refine((data) => data.exercises.length > 0, {
    message: 'At least one exercise is required.',
    path: ['exercises'],
  });

const createProgram = z
  .object({
    programName: z.string().min(1, 'Program name is required.'),
    sessions: z
      .array(sessionSchema)
      .min(1, { message: 'At least one session is required.' }),
    mode: z.enum(['create', 'template']),
    assignedUser: z
      .object({
        label: z.string().min(1, 'User label is required.'),
        value: z.string().min(1, 'User value is required.'),
      })
      .nullable()
      .optional(),
    activationDate: z.date().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    // Conditional validation based on the mode
    if (data.mode === 'create') {
      if (!data.assignedUser) {
        ctx.addIssue({
          path: ['assignedUser'],
          message: 'Assigned user is required when creating a program.',
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.activationDate) {
        ctx.addIssue({
          path: ['activationDate'],
          message: 'Activation date is required when creating a program.',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export default createProgram;
