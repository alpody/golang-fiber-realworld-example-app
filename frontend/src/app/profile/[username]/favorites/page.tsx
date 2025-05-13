import { decodePathParams } from "@/modules/common/functions/url";
import Link from "next/link";
import { Suspense } from "react";
import { FavoriteArticleList } from "./_components/favoriteArticleList";
import { SearchParams } from "./_types/types";

const FavoritesPage = async (props: {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParams = SearchParams.parse(await props.searchParams);
  const pathParams = decodePathParams(await props.params);

  return (
    <>
      <div className="articles-toggle">
        <ul className="nav nav-pills outline-active">
          <li className="nav-item">
            <Link className="nav-link" href={`/profile/${pathParams.username}`}>
              My Articles
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link active" href={`/profile/${pathParams.username}/favorites`}>
              Favorited Articles
            </Link>
          </li>
        </ul>
      </div>
      <Suspense key={JSON.stringify(searchParams)} fallback={<p>⌛Loading...</p>}>
        <FavoriteArticleList currentPage={searchParams.page} username={pathParams.username} />
      </Suspense>
    </>
  );
};

export default FavoritesPage;
