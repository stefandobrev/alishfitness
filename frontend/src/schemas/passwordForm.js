import { z } from 'zod';

export const passwordForm = z
  .object({
    currentPassword: z.string().nonempty('Current password is required.'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long.'),
    confirmPassword: z.string(),
  })
  .superRefine(({ newPassword, currentPassword }, ctx) => {
    if (newPassword === currentPassword) {
      ctx.addIssue({
        path: ['newPassword'],
        message: 'New password should be different than current password.',
        code: z.ZodIssueCode.custom,
      });
    }
  })

  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: "Passwords don't match.",
        code: z.ZodIssueCode.custom,
      });
    }
  });
