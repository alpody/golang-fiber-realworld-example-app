import { createApiClient } from "@/utils/api/apiClient";
import { User } from "@/utils/types/models";

export const fetchCurrentUser = async () => {
  const client = createApiClient({
    path: "/user",
    method: "get",
    params: {},
  });

  const response = await client.sendRequest();

  if (response.result === "success") {
    return User.parse(response.data?.user);
  }

  throw new Error("api error");
};
