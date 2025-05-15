import { z } from "zod";

export const SearchParams = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  tab: z.enum(["yours", "global", "tag"]).default("global"),
  tag: z.string().optional(),
});

export type SearchParams = z.infer<typeof SearchParams>;
