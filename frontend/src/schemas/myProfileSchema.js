import { z } from 'zod';

const myProfileSchema = z.object({
  firstName: z
    .string()
    .min(3, 'First name must be at least 3 characters.')
    .nonempty('First name is required.'),

  lastName: z
    .string()
    .min(3, 'Last name must be at least 3 characters.')
    .nonempty('Last name is required.'),
});

export default myProfileSchema;
