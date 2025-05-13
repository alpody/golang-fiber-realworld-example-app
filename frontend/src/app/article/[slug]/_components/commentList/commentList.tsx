import { fetchComments } from "@/modules/features/article/fetch/fetchComments";
import { fetchCurrentUser } from "@/modules/features/auth/fetch/fetchCurrentUser";
import { getSession } from "@/utils/auth/session";
import { CommentCard } from "../commentCard";

type Props = {
  slug: string;
};

export const CommentList = async ({ slug }: Props) => {
  const comments = await fetchComments(slug);
  const currentUserPromise = (await getSession()) ? fetchCurrentUser() : undefined;

  return (
    <>
      {comments.map((comment, index) => (
        <CommentCard key={index} slug={slug} comment={comment} currentUserPromise={currentUserPromise} />
      ))}
    </>
  );
};
