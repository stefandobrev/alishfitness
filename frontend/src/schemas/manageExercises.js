import { z } from 'zod';

const selectOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const manageExercises = z.object({
  title: z
    .string()
    .min(1, 'Title is required.')
    .regex(
      /^[a-zA-Z0-9 ]*$/,
      'Title must contain only letters, numbers, and spaces',
    ),
  primaryGroup: z
    .union([
      selectOptionSchema,
      z.string().min(1, 'Primary group is required.'),
      z.null(),
    ])
    .default(null) // Set default here to override react-select error
    .refine(
      (val) => {
        if (val === null) return false;
        if (typeof val === 'string') return val.length > 0;
        return !!val?.value;
      },
      { message: 'Primary group is required.' },
    ),
  secondaryGroups: z.array(z.string()).optional().default([]),
  steps: z.array(z.string()).optional().default([]),
  gifLinkFront: z
    .string()
    .min(1, 'Front GIF link is required.')
    .url('Invalid URL format'),
  gifLinkSide: z
    .string()
    .min(1, 'Side GIF link is required.')
    .url('Invalid URL format'),
  videoLink: z.string().url('Invalid URL format').optional().or(z.literal('')),
  mistakes: z.array(z.string()).optional().default([]),
});
