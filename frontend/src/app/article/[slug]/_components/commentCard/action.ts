"use server";

import { createApiClient } from "@/utils/api/apiClient";
import { getSession } from "@/utils/auth/session";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { Inputs } from "./types";

export const deleteCommentAction = async (_prevState: undefined, inputs: Inputs): Promise<undefined> => {
  if ((await getSession()) == null) {
    redirect("/login");
  }

  const apiClient = createApiClient({
    path: "/articles/{slug}/comments/{id}",
    method: "delete",
    params: {
      path: inputs,
    },
  });

  const response = await apiClient.sendRequest();

  if (response.result === "success") {
    revalidateTag("");
    return undefined;
  }

  throw new Error("api error");
};
