import { z } from 'zod';

const profileSettings = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required.')
      .email('Invalid email address.'),

    username: z.string().min(3, 'Username must be at least 3 characters long.'),

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

export default profileSettings;
