import { z } from "zod";

export const exampleZodSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const createZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const updateZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type exampleSchema = z.infer<typeof exampleZodSchema>;
export type createSchema = z.infer<typeof createZodSchema>;
export type updateSchema = z.infer<typeof updateZodSchema>;
