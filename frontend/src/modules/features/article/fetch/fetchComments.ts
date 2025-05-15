import { createApiClient } from "@/utils/api/apiClient";
import { Comment } from "@/utils/types/models";

export const fetchComments = async (slug: string) => {
  const client = createApiClient({
    path: "/articles/{slug}/comments",
    method: "get",
    params: {
      path: {
        slug,
      },
    },
  });

  const response = await client.sendRequest();

  if (response.result === "success") {
    return response.data.comments.map((comment) => Comment.parse(comment));
  }

  throw new Error("api error.");
};
