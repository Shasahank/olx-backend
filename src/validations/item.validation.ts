import { z } from "zod";

export const createItemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  description: z.string().min(10, "Description must be at least 10 characters"),

  price: z.number().positive("Price must be greater than 0"),

  image_url: z.string().url("Invalid image URL").optional(),
});

export const updateItemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),

  price: z.number().positive("Price must be greater than 0").optional(),

  image_url: z.string().url("Invalid image URL").optional(),

  status: z.enum(["available", "sold"]).optional(),
});
