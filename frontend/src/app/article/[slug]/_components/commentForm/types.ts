import { z } from "zod";

export const inputsSchema = z.object({
  slug: z.string().max(200),
  body: z.string().max(200),
});

export type Inputs = z.infer<typeof inputsSchema>;
