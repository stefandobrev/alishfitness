import { z } from 'zod';

export const myProfile = z.object({
  firstName: z.string().min(3, 'First name must be at least 3 characters.'),

  lastName: z.string().min(3, 'Last name must be at least 3 characters.'),
});
