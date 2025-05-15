import { ArticlePreview } from "@/utils/types/models";
import Link from "next/link";
import { Tag } from "../tag";
import { FavoriteButton } from "../favoriteButton";

type Props = {
  article: ArticlePreview;
};

export const ArticleCard = ({ article }: Props) => {
  const author = article.author;

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link href={`/profile/${author.username}`}>{author.image && <img src={author.image} alt="" />}</Link>
        <div className="info">
          <Link href={`/profile/${author.username}`} className="author">
            {author.username}
          </Link>
          <span className="date">{article.createdAt.toDateString()}</span>
        </div>
        <FavoriteButton {...article} showMessage={false} className="pull-xs-right" />
      </div>
      <Link href={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag, index) => (
            <Tag component="li" key={index} variant="outline">
              {tag}
            </Tag>
          ))}
        </ul>
      </Link>
    </div>
  );
};
