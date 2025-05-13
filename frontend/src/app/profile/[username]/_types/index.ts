import { z } from "zod";

export const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
