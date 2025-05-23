import { z } from 'zod';

export const profileSettings = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required.')
      .email('Invalid email address.'),

    username: z
      .string()
      .min(3, 'Username must be at least 3 characters long.')
      .regex(
        /^[a-zA-Z0-9-_]+$/,
        'Username can only contain letters, numbers, hyphens, and underscores.',
      ),

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
