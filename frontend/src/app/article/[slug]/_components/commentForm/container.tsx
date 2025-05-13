"use client";

import { User } from "@/utils/types/models";
import { use, useActionState } from "react";
import { postCommentAction } from "./action";
import { CommentForm as CommentFormPresentation } from "./presentation";

type Props = {
  slug: string;
  currentUserPromise?: Promise<User>;
};

export const CommentForm = ({ slug, currentUserPromise }: Props) => {
  const currentUser = currentUserPromise && use(currentUserPromise);
  const [state, action, isPending] = useActionState(postCommentAction, undefined);

  return (
    <CommentFormPresentation
      slug={slug}
      authorImage={currentUser?.image}
      result={state}
      postCommentAction={action}
      isPending={isPending}
    />
  );
};
