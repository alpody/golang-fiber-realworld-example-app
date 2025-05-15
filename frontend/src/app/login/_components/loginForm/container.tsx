"use client";

import { LoginForm as LoginFormPresentation } from "./presentation";
import { signInAction } from "./action";
import { useActionState } from "react";

export const LoginForm = () => {
  const [state, action, isPending] = useActionState(signInAction, undefined);

  return <LoginFormPresentation result={state} action={action} isPending={isPending} />;
};
