import { z } from 'zod';

export const myProfile = z.object({
  firstName: z
    .string()
    .min(3, 'First name must be at least 3 characters.')
    .regex(
      /^[a-zA-Z\s-]+$/,
      'First name can only contain letters, spaces, and hyphens.',
    ),

  lastName: z
    .string()
    .min(3, 'Last name must be at least 3 characters.')
    .regex(
      /^[a-zA-Z\s-]+$/,
      'Last name can only contain letters, spaces, and hyphens.',
    ),
});
