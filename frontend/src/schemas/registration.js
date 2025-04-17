import { z } from 'zod';

export const registration = z
  .object({
    firstName: z.string().min(3, 'First name must be at least 3 characters.'),

    lastName: z.string().min(3, 'Last name must be at least 3 characters.'),

    username: z.string().min(3, 'Username must be at least 3 characters long.'),

    email: z
      .string()
      .min(1, 'Email is required.')
      .email('Invalid email address.'),

    password: z.string().min(8, 'Password must be at least 8 characters long.'),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: "Passwords don't match.",
        code: z.ZodIssueCode.custom,
      });
    }
  });
