import { User } from "@/utils/types/models";

export const showDeleteCommentButton = (commentAuthorUsername: string, currentUser?: User) => {
  return commentAuthorUsername === currentUser?.username;
};
