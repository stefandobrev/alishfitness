import { z } from 'zod';

const exerciseSchema = z.object({
  sequence: z.string().min(1, 'Required'),
  muscleGroup: z.string().min(1, 'Required'),
  slug: z.string().min(1, 'Required'),
  sets: z.string().min(1, 'Required'),
  reps: z.string().min(1, 'Required'),
});

const sessionSchema = z.object({
  title: z.string().min(1, 'Session title is required.'),
  exercises: z
    .array(exerciseSchema)
    .min(1, 'At least one exercise is required.'),
});

const createProgram = z
  .object({
    programName: z.string().min(1, 'Program name is required.'),
    sessions: z
      .array(sessionSchema)
      .min(1, { message: 'At least one session is required.' }),
    scheduleArray: z.array(z.string()).optional(),
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
    if (data.mode === 'create') {
      if (!data.assignedUser) {
        ctx.addIssue({
          path: ['assignedUser'],
          message: 'Assigned user is required.',
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.activationDate) {
        ctx.addIssue({
          path: ['activationDate'],
          message: 'Activation date is required.',
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.scheduleArray || data.scheduleArray.length === 0) {
        ctx.addIssue({
          path: ['scheduleArray'],
          message: 'Schedule is required.',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export default createProgram;
