import { Button } from "@/modules/common/components/button";
import { DeleteArticleButton } from "@/modules/features/article/components/deleteArticleButton";
import { FavoriteButton } from "@/modules/features/article/components/favoriteButton";
import { Tag } from "@/modules/features/article/components/tag";
import { fetchArticle } from "@/modules/features/article/fetch/fetchArticle";
import { convertMarkdownToHtml } from "@/modules/features/article/functions";
import { FollowButton } from "@/modules/features/profile/components/followButton";
import { Article, User } from "@/utils/types/models";
import Link from "next/link";
import { ReactNode } from "react";
import styles from "./articleArea.module.css";
import { showDeleteArticleButton, showEditArticleButton, showFollowButton } from "./functions";
import { getSession } from "@/utils/auth/session";
import { fetchCurrentUser } from "@/modules/features/auth/fetch/fetchCurrentUser";

const Actions = ({ article, currentUser }: { article: Article; currentUser?: User }) => {
  const profile = article.author;

  return (
    <div className="article-meta">
      <Link href={`/profile/${profile.username}`}>{profile.image && <img src={profile.image} alt="" />}</Link>
      <div className="info">
        <Link href={`/profile/${profile.username}`} className="author">
          {profile.username}
        </Link>
        <span className="date">{article.createdAt.toDateString()}</span>
      </div>
      {showFollowButton(profile.username, currentUser) && (
        <FollowButton {...profile} className={styles["action-btn"]} />
      )}
      <FavoriteButton {...article} showMessage={true} className={styles["action-btn"]} />
      {showEditArticleButton(profile.username, currentUser) && (
        <Button component="a" href={`/editor/${article.slug}`} color="secondary" className={styles["action-btn"]}>
          <i className="ion-edit"></i> Edit Article
        </Button>
      )}
      {showDeleteArticleButton(profile.username, currentUser) && (
        <DeleteArticleButton slug={article.slug} className={styles["action-btn"]} />
      )}
    </div>
  );
};

export const ArticleArea = async ({ slug, children }: { slug: string; children: ReactNode }) => {
  const article = await fetchArticle(slug);
  const body = await convertMarkdownToHtml(article.body);
  const currentUser = (await getSession()) ? await fetchCurrentUser() : undefined;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <Actions article={article} currentUser={currentUser} />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div dangerouslySetInnerHTML={{ __html: body }} />
            <ul className="tag-list">
              {article.tagList.map((tag, index) => (
                <Tag component="li" variant="outline" key={index}>
                  {tag}
                </Tag>
              ))}
            </ul>
          </div>
        </div>
        <hr />
        <div className="article-actions">
          <Actions article={article} currentUser={currentUser} />
        </div>
        {children}
      </div>
    </div>
  );
};
