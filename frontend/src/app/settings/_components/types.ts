import { z } from "zod";

export const inputsSchema = z.object({
  image: z.string().max(200).optional(),
  username: z.string().max(200),
  bio: z.string().max(200).optional(),
  email: z.string().max(200).email(),
  password: z.string().min(4).max(200).optional(),
});

export type Inputs = z.infer<typeof inputsSchema>;
