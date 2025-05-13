"use server";

import { createApiClient } from "@/utils/api/apiClient";
import { getSession } from "@/utils/auth/session";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { State } from "./types";

export const favoriteAction = async (prevState: State, slug: string): Promise<State> => {
  if ((await getSession()) == null) {
    redirect("/login");
  }

  const apiClient = createApiClient({
    path: "/articles/{slug}/favorite",
    method: prevState.favorited ? "delete" : "post",
    params: {
      path: {
        slug,
      },
    },
  });

  const response = await apiClient.sendRequest();
  revalidateTag("");

  if (response.result === "success") {
    return {
      favorited: response.data.article.favorited,
      favoritesCount: response.data.article.favoritesCount,
    };
  }

  throw new Error("api error");
};
