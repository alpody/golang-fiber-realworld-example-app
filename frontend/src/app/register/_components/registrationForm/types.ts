import { z } from "zod";

export const inputsSchema = z.object({
  username: z.string().max(200),
  email: z.string().email(),
  password: z.string().min(4).max(200),
});

export type Inputs = z.infer<typeof inputsSchema>;
