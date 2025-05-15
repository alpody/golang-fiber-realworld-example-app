"use server";

import { createApiClient } from "@/utils/api/apiClient";
import { getSession } from "@/utils/auth/session";
import { redirect } from "next/navigation";

export const deleteArticleAction = async (_prevState: undefined, slug: string) => {
  if ((await getSession()) == null) {
    redirect("/login");
  }

  const apiClient = createApiClient({
    path: "/articles/{slug}",
    method: "delete",
    params: {
      path: {
        slug,
      },
    },
  });

  const response = await apiClient.sendRequest();
  if (response.result === "success") {
    redirect("/");
  }

  throw new Error("api error");
};
