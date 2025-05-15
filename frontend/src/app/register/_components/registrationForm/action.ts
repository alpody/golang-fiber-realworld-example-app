"use server";

import { createApiClient } from "@/utils/api/apiClient";
import { createSession } from "@/utils/auth/session";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { inputsSchema } from "./types";

export const signUpAction = async (_prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: inputsSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const client = createApiClient({
    path: "/users",
    method: "post",
    params: {
      body: {
        user: submission.value,
      },
    },
  });

  const response = await client.sendRequest();

  if (response.result === "success") {
    createSession(response.data.user.token);
    redirect("/");
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
