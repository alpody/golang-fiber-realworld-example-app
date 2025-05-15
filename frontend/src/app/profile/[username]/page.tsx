import { decodePathParams } from "@/modules/common/functions/url";
import Link from "next/link";
import { Suspense } from "react";
import { MyArticleList } from "./_components/myArticleList";
import { searchParamsSchema } from "./_types";

const ProfilePage = async (props: {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const pathParams = decodePathParams(await props.params);
  const searchParams = searchParamsSchema.parse(await props.searchParams);

  return (
    <>
      <div className="articles-toggle">
        <ul className="nav nav-pills outline-active">
          <li className="nav-item">
            <Link className="nav-link active" href={`/profile/${pathParams.username}`}>
              My Articles
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href={`/profile/${pathParams.username}/favorites`}>
              Favorited Articles
            </Link>
          </li>
        </ul>
      </div>
      <Suspense key={JSON.stringify(searchParams)} fallback={<p>⌛Loading...</p>}>
        <MyArticleList currentPage={searchParams.page} username={pathParams.username} />
      </Suspense>
    </>
  );
};

export default ProfilePage;
