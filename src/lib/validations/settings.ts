import { z } from "zod";

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(80, "Display name must be 80 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .max(17, "Phone number is too long.")
    .regex(/^\+?[0-9][0-9\s()-]{6,16}$/, "Enter a valid phone number.")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export interface NotificationPrefs {
  productUpdates: boolean;
  newOrders: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  productUpdates: true,
  newOrders: true,
  weeklyDigest: false,
  securityAlerts: true,
};
