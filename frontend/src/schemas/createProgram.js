import { z } from 'zod';

const sessionSchema = z.object({
  title: z.string().min(1, 'Session title is required.'),
  exercises: z.array(
    z.object({
      sequence: z.string().min(1, 'Sequence is required.'),
    }),
  ),
});

const createProgram = z.object({
  programName: z.string().min(1, 'Program name is required.'),
  sessions: z.array(sessionSchema),
});
export default createProgram;
