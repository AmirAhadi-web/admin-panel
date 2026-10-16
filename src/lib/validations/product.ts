import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(120, "Name must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer.")
    .optional()
    .or(z.literal("")),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number." })
    .min(0, "Price cannot be negative.")
    .max(1_000_000, "Price must be below $1,000,000."),
  category: z.string().trim().min(1, "Category is required.").max(60),
  stock: z.coerce
    .number({ invalid_type_error: "Stock must be a number." })
    .int("Stock must be a whole number.")
    .min(0, "Stock cannot be negative.")
    .max(1_000_000, "Stock must be below 1,000,000."),
  imageUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^https?:\/\/.+/i.test(value),
      "Enter a valid http(s) URL.",
    )
    .optional()
    .or(z.literal("")),
  status: z.enum(["active", "draft", "archived"]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
