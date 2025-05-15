import { getSession } from "@/utils/auth/session";
import { fetchCurrentUser } from "../../fetch/fetchCurrentUser";
import { Header as HeaderPresentation } from "./presentation";

export const Header = async () => {
  const session = await getSession();

  if (session == null) {
    return <HeaderPresentation authUser={undefined} />;
  }

  const user = await fetchCurrentUser();
  return <HeaderPresentation authUser={user} />;
};
