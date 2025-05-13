import { User } from "@/utils/types/models";

export const showFollowButton = (authorUsername: string, currentUser: User | undefined) => {
  return authorUsername !== currentUser?.username;
};

export const showEditArticleButton = (authorUsername: string, currentUser: User | undefined) => {
  return authorUsername === currentUser?.username;
};

export const showDeleteArticleButton = (authorUsername: string, currentUser: User | undefined) => {
  return authorUsername === currentUser?.username;
};
