import { z } from "zod";

export const inputsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type Inputs = z.infer<typeof inputsSchema>;
