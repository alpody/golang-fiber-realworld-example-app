import { createApiClient } from "@/utils/api/apiClient";

export const fetchTagsList = async () => {
  const client = createApiClient({
    path: "/tags",
    method: "get",
    params: {},
    revalidate: 60,
  });

  const response = await client.sendRequest();

  if (response.result === "success") {
    return response.data.tags;
  }

  throw new Error("api error.");
};
