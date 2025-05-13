import "server-only";
import { SECURE_COOKIE } from "@/config/constants";
import { cookies } from "next/headers";

const SESSION_KEY = "session";

export const createSession = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_KEY, token, {
    httpOnly: true,
    secure: SECURE_COOKIE,
    expires: new Date(Date.now() + 1000 * 60 * 60), // one hour
    sameSite: "lax",
    path: "/",
  });
};

export const getSession = async () => {
  return (await cookies()).get(SESSION_KEY)?.value;
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_KEY);
};
