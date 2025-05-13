import { Comment } from "@/utils/types/models";
import Link from "next/link";
import styles from "./presentation.module.css";

type Props = {
  comment: Comment;
  showDeleteCommentButton?: boolean;
  deleteCommentAction?: () => void;
  isPending?: boolean;
};

export const CommentCard = ({ comment, showDeleteCommentButton, deleteCommentAction }: Props) => {
  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link href={`/profile/${comment.author.username}`} className="comment-author">
          {comment.author.image && <img src={comment.author.image} className="comment-author-img" alt="" />}
        </Link>
        &nbsp;
        <Link href={`/profile/${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </Link>
        <span className="date-posted">{comment.createdAt.toDateString()}</span>
        {showDeleteCommentButton && (
          <form action={deleteCommentAction} className={styles["form"]}>
            <button className="mod-options" type="submit">
              <i className="ion-trash-a" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
