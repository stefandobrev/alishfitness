import { z } from 'zod';

const registrationSchema = z
  .object({
    firstName: z
      .string()
      .min(3, 'First name must be at least 3 characters.')
      .nonempty('First name is required.'),

    lastName: z
      .string()
      .min(3, 'Last name must be at least 3 characters.')
      .nonempty('Last name is required.'),

    username: z
      .string()
      .min(3, 'Username must be at least 3 characters long.')
      .nonempty('Username is required.'),

    email: z
      .string()
      .email('Invalid email address.')
      .nonempty('Email is required.'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .nonempty('Password is required.'),
    confirmPassword: z.string().nonempty('Confirm password is required.'),
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

export default registrationSchema;
