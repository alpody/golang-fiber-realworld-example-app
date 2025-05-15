"use server";

import { createApiClient } from "@/utils/api/apiClient";
import { getSession } from "@/utils/auth/session";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { inputsSchema } from "./types";

export const createArticleAction = async (_prevState: unknown, formData: FormData) => {
  if ((await getSession()) == null) {
    redirect("/login");
  }

  const submission = parseWithZod(formData, { schema: inputsSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { slug: _slug, tag: _tag, ...article } = submission.value;

  const client = createApiClient({
    path: "/articles",
    method: "post",
    params: {
      body: {
        article,
      },
    },
  });

  const response = await client.sendRequest();

  if (response.result === "success") {
    redirect(`/article/${response.data.article.slug}`);
  }

  switch (response.statusCode) {
    case 422:
      return submission.reply({
        formErrors: Object.values(response.error.errors).flat(),
      });
    default:
      throw new Error("api error");
  }
};

export const updateArticleAction = async (_prevState: unknown, formData: FormData) => {
  if ((await getSession()) == null) {
    redirect("/login");
  }

  const submission = parseWithZod(formData, { schema: inputsSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { slug, tag: _tag, ...article } = submission.value;
  if (slug == null) {
    throw new Error("Slug is unexpectedly set to null or undefined.");
  }

  const client = createApiClient({
    path: "/articles/{slug}",
    method: "put",
    params: {
      path: {
        slug,
      },
      body: {
        article,
      },
    },
  });

  const response = await client.sendRequest();

  if (response.result === "success") {
    redirect(`/article/${response.data.article.slug}`);
  }

  switch (response.statusCode) {
    case 422:
      return submission.reply({
        formErrors: Object.values(response.error.errors).flat(),
      });
    default:
      throw new Error("api error");
  }
};
