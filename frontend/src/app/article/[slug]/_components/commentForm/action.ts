"use server";

import { createApiClient } from "@/utils/api/apiClient";
import { getSession } from "@/utils/auth/session";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { inputsSchema } from "./types";

export const postCommentAction = async (
  _prevState: unknown,
  formData: FormData,
): Promise<SubmissionResult<string[]>> => {
  if ((await getSession()) == null) {
    redirect("/login");
  }

  const submission = parseWithZod(formData, { schema: inputsSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { slug, body } = submission.value;

  const apiClient = createApiClient({
    path: "/articles/{slug}/comments",
    method: "post",
    params: {
      path: {
        slug,
      },
      body: {
        comment: {
          body,
        },
      },
    },
  });

  const response = await apiClient.sendRequest();

  if (response.result === "success") {
    revalidateTag("");
    return submission.reply();
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
