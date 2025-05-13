import { createApiClient } from "@/utils/api/apiClient";
import { Article } from "@/utils/types/models";

export const fetchArticle = async (slug: string) => {
  const apiClient = createApiClient({
    path: "/articles/{slug}",
    method: "get",
    params: {
      path: {
        slug,
      },
    },
  });

  const response = await apiClient.sendRequest();

  if (response.result === "success") {
    return Article.parse(response.data.article);
  }

  throw new Error("api error.");
};
