import { z } from 'zod';

const exerciseSchema = z.object({
  sequence: z.string().min(1, 'Required'),
  muscleGroup: z.string().min(1, 'Required'),
  exerciseInput: z.string().min(1, 'Required'),
  sets: z.string().min(1, 'Required'),
  reps: z.string().min(1, 'Required'),
});

const sessionSchema = z.object({
  tempId: z.string().min(1, 'Session tempId is required.'),
  sessionTitle: z.string().min(1, 'Session title is required.'),
  exercises: z
    .array(exerciseSchema)
    .min(1, 'At least one exercise is required.')
    .refine(
      (exercises) => {
        const sequences = new Set();
        for (const exercise of exercises) {
          if (sequences.has(exercise.sequence)) {
            return false; // Duplicate found
          }
          sequences.add(exercise.sequence);
        }
        return true; // All sequences are unique
      },
      {
        message: 'Sequences must be unique.',
        path: ['sequence'],
      },
    ),
});

export const createProgram = z
  .object({
    programTitle: z.string().min(1, 'Program title is required.'),
    sessions: z
      .array(sessionSchema)
      .min(1, { message: 'At least one session is required.' }),
    scheduleArray: z.array(z.string()).min(1, 'Schedule is required.'),
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
    }

    // Ensure every session appears at least once in scheduleArray
    const missingSessions = data.sessions.filter(
      (s) => !data.scheduleArray.includes(s.tempId),
    );

    if (missingSessions.length > 0) {
      ctx.addIssue({
        path: ['scheduleArray'],
        message: 'Sessions missing.',
        code: z.ZodIssueCode.custom,
      });
    }
  });
