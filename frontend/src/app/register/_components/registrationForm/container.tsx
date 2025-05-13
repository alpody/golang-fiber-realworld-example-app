"use client";

import { useActionState } from "react";
import { signUpAction } from "./action";
import { RegistrationForm as RegistrationFormPresentation } from "./presentation";

export const RegistrationForm = () => {
  const [state, dispatch, isPending] = useActionState(signUpAction, undefined);

  return <RegistrationFormPresentation result={state} action={dispatch} isPending={isPending} />;
};
