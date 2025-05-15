"use server";

import { deleteSession } from "@/utils/auth/session";
import { redirect } from "next/navigation";

export const logoutAction = async () => {
  await deleteSession();
  redirect("/login");
};
