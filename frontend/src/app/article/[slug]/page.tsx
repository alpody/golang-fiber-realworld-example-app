import { fetchCurrentUser } from "@/modules/features/auth/fetch/fetchCurrentUser";
import { getSession } from "@/utils/auth/session";
import { Suspense } from "react";
import { ArticleArea } from "./_components/articleArea";
import { CommentForm } from "./_components/commentForm";
import { CommentList } from "./_components/commentList";

type Params = Promise<{
  slug: string;
}>;

const Page = async (props: { params: Params }) => {
  const currentUserPromise = (await getSession()) ? fetchCurrentUser() : undefined;
  const params = await props.params;

  return (
    <ArticleArea slug={params.slug}>
      <div className="row">
        <div className="col-xs-12 col-md-8 offset-md-2">
          <CommentForm slug={params.slug} currentUserPromise={currentUserPromise} />
          <Suspense fallback={<p>⌛Loading comments...</p>}>
            <CommentList slug={params.slug} />
          </Suspense>
        </div>
      </div>
    </ArticleArea>
  );
};

export default Page;
