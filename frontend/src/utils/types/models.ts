import { z } from "zod";

export const Profile = z.object({
  username: z.string(),
  bio: z
    .string()
    .nullish()
    .transform((x) => x ?? undefined),
  image: z
    .string()
    .nullish()
    .transform((x) => x ?? undefined),
  following: z.boolean(),
});

export type Profile = z.infer<typeof Profile>;

export const Article = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.array(z.string()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  favorited: z.boolean(),
  favoritesCount: z.number(),
  author: Profile,
});

export type Article = z.infer<typeof Article>;

export const ArticlePreview = Article.omit({ body: true, updatedAt: true });

export type ArticlePreview = z.infer<typeof ArticlePreview>;

export const Comment = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  body: z.string(),
  author: Profile,
});

export type Comment = z.infer<typeof Comment>;

export const User = z.object({
  email: z.string(),
  token: z.string(),
  username: z.string(),
  image: z
    .string()
    .nullish()
    .transform((x) => x ?? undefined),
  bio: z
    .string()
    .nullish()
    .transform((x) => x ?? undefined),
});

export type User = z.infer<typeof User>;
