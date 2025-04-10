import { z } from 'zod';

const sessionSchema = z.object({
  title: z.string().min(1, 'Session title is required.'),
  exercises: z
    .array(
      z.object({
        sequence: z.string().min(1, 'Required'),
        muscleGroup: z.string().min(1, 'Required'),
        slug: z.string().min(1, 'Required'),
        sets: z.string().optional(),
        reps: z.string().optional(),
      }),
    )
    .min(1, 'At least one exercise is required.'),
});

const createProgram = z
  .object({
    programName: z.string().min(1, 'Program name is required.'),
    sessions: z
      .array(sessionSchema)
      .min(1, 'At least one session is required.'),
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
  .refine((data) => data.mode !== 'create' || data.assignedUser !== null, {
    message: 'Assigned user is required',
    path: ['assignedUser'],
  })
  .refine((data) => data.mode !== 'create' || data.activationDate !== null, {
    message: 'Activation date is required',
    path: ['activationDate'],
  });

export default createProgram;
