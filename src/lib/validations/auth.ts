import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required.")
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must be 30 characters or fewer.")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Only letters, numbers, dots, hyphens, and underscores.",
    ),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
  remember: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
