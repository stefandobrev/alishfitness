import { z } from 'zod';

const profileSettings = z
  .object({
    email: z
      .string()
      .email('Invalid email address.')
      .nonempty('Email is required.'),

    username: z
      .string()
      .min(3, 'Username must be at least 3 characters long.')
      .nonempty('Username is required.'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .nonempty('Password is required.'),
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

export default profileSettings;
