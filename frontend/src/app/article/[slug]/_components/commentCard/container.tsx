"use client";

import { Comment, User } from "@/utils/types/models";
import { use, useActionState } from "react";
import { deleteCommentAction as serverAction } from "./action";
import { CommentCard as CommentCardPresentation } from "./presentation";
import { showDeleteCommentButton } from "./functions";

type Props = {
  slug: string;
  comment: Comment;
  currentUserPromise?: Promise<User>;
};

export const CommentCard = ({ slug, comment, currentUserPromise }: Props) => {
  const [_state, dispatch, isPending] = useActionState(serverAction, undefined);

  const action = () => {
    if (!confirm("Delete comment?")) {
      return;
    }
    dispatch({ slug, id: comment.id });
  };

  return (
    <CommentCardPresentation
      comment={comment}
      showDeleteCommentButton={showDeleteCommentButton(
        comment.author.username,
        currentUserPromise && use(currentUserPromise),
      )}
      deleteCommentAction={action}
      isPending={isPending}
    />
  );
};
