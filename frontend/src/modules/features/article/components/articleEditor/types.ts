import { z } from "zod";

export const inputsSchema = z.object({
  slug: z.string().optional(),
  title: z.string().max(200),
  description: z.string().max(500),
  body: z.string().max(2000),
  tagList: z.array(z.string().max(20)),
  tag: z.string().max(20).optional(),
});

export type Inputs = z.infer<typeof inputsSchema>;
