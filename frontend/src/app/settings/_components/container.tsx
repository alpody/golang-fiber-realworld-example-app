"use client";

import { use, useActionState } from "react";
import { SettingsForm as SettingsFormPresentation } from "./presentation";
import { updateSettingsAction } from "./action";
import { User } from "@/utils/types/models";

export const SettingsForm = ({ user }: { user: Promise<User> }) => {
  const [state, action, isPending] = useActionState(updateSettingsAction, undefined);

  return <SettingsFormPresentation user={use(user)} result={state} action={action} isPending={isPending} />;
};
