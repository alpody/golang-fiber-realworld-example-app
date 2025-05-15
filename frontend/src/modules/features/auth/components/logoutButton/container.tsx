"use client";

import { useActionState } from "react";
import { logoutAction } from "./action";
import { LogoutButton as LogoutButtonPresentation } from "./presentation";

export const LogoutButton = () => {
  const [_state, action, isPending] = useActionState(logoutAction, undefined);

  return <LogoutButtonPresentation action={action} isPending={isPending} />;
};
