"use server";

import { createApiClient } from "@/utils/api/apiClient";
import { redirect } from "next/navigation";
import { inputsSchema } from "./types";
import { createSession } from "@/utils/auth/session";
import { parseWithZod } from "@conform-to/zod";
import { SubmissionResult } from "@conform-to/react";

export const updateSettingsAction = async (_prevState: SubmissionResult<string[]> | undefined, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: inputsSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const client = createApiClient({
    path: "/user",
    method: "put",
    params: {
      body: {
        user: submission.value,
      },
    },
  });

  const response = await client.sendRequest();

  if (response.result === "success") {
    const user = response.data.user;
    await createSession(user.token);
    redirect(`/profile/${user.username}`);
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
