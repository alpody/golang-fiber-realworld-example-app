import { getSession } from "@/utils/auth/session";
import { ExhaustiveError } from "@/utils/errors";
import clsx from "clsx";
import Link from "next/link";
import { Suspense } from "react";
import { FeedArticleList } from "./_components/feedArticleList";
import { GlobalArticleList } from "./_components/globalArticleList";
import { TagArticleList } from "./_components/tagArticleList";
import { TagList } from "./_components/tagList";
import { SearchParams } from "./_types";

const ArticleList = (searchParams: SearchParams) => {
  switch (searchParams.tab) {
    case "yours":
      return <FeedArticleList currentPage={searchParams.page} />;
    case "global":
      return <GlobalArticleList currentPage={searchParams.page} />;
    case "tag":
      return <TagArticleList currentPage={searchParams.page} tag={searchParams.tag ?? ""} />;
    default:
      throw new ExhaustiveError(searchParams.tab, "all tab cases are not covered");
  }
};

const Page = async (props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const session = await getSession();
  const searchParams = SearchParams.parse(await props.searchParams);

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {session && (
                  <li className="nav-item">
                    <Link className={clsx("nav-link", searchParams.tab === "yours" && "active")} href="/?tab=yours">
                      Your Feed
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className={clsx("nav-link", searchParams.tab === "global" && "active")} href="/?tab=global">
                    Global Feed
                  </Link>
                </li>
                {searchParams.tag && (
                  <li className="nav-item">
                    <Link
                      className={clsx("nav-link", searchParams.tab === "tag" && "active")}
                      href={`/?tab=tag&tag=${searchParams.tag}`}
                    >
                      #{searchParams.tag}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <Suspense key={JSON.stringify(searchParams)} fallback={<p>⌛Loading...</p>}>
              <ArticleList {...searchParams} />
            </Suspense>
          </div>

          <div className="col-md-3">
            <Suspense fallback={<p>⌛Loading...</p>}>
              <TagList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
