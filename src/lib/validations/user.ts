import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be 80 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  role: z.enum(["admin", "editor", "viewer"]),
  status: z.enum(["active", "invited", "suspended"]),
});

export type UserFormValues = z.infer<typeof userSchema>;
