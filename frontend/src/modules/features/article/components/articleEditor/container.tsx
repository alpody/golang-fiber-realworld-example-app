"use client";

import { use, useActionState } from "react";
import { createArticleAction, updateArticleAction } from "./action";
import { ArticleEditor as ArticleEditorPresentation } from "./presentation";
import { Article } from "@/utils/types/models";

export const CreateArticleEditor = () => {
  const [state, action, isPending] = useActionState(createArticleAction, undefined);

  return <ArticleEditorPresentation result={state} action={action} isPending={isPending} />;
};

export const UpdateArticleEditor = ({ defaultValues }: { defaultValues: Promise<Article> }) => {
  const [state, action, isPending] = useActionState(updateArticleAction, undefined);

  return (
    <ArticleEditorPresentation
      defaultValues={use(defaultValues)}
      result={state}
      action={action}
      isPending={isPending}
    />
  );
};
