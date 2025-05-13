import { createApiClient } from "@/utils/api/apiClient";
import { Profile } from "@/utils/types/models";
import { cache } from "react";

export const fetchProfile = cache(async (username: string) => {
  const client = createApiClient({
    path: "/profiles/{username}",
    method: "get",
    params: {
      path: {
        username,
      },
    },
  });

  const response = await client.sendRequest();

  if (response.result === "success") {
    return Profile.parse(response.data.profile);
  }

  throw new Error("api error");
});
