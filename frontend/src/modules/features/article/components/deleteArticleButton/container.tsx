"use client";

import { useActionState } from "react";
import { deleteArticleAction } from "./action";
import { DeleteArticleButton as DeleteArticleButtonPresentation } from "./presentation";

type Props = {
  slug: string;
  className?: string;
};

export const DeleteArticleButton = ({ slug, className }: Props) => {
  const [_state, dispatch, isPending] = useActionState(deleteArticleAction, undefined);

  const action = () => {
    if (!confirm("Delete this article?")) {
      return;
    }
    dispatch(slug);
  };

  return <DeleteArticleButtonPresentation action={action} isPending={isPending} className={className} />;
};
