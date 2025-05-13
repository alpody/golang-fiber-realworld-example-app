import { Button } from "@/modules/common/components/button";
import clsx from "clsx";
import styles from "./presentation.module.css";

type Props = {
  favorited: boolean;
  favoritesCount: number;
  action?: () => void;
  disabled?: boolean;
  showMessage?: boolean;
  className?: string;
};

export const FavoriteButton = ({ favorited, favoritesCount, action, disabled, showMessage, className }: Props) => {
  const content = showMessage ? (
    <>
      <i className="ion-heart"></i> {favorited ? "Unfavorite Article " : "Favorite Article "}
      <span className="counter">({favoritesCount})</span>
    </>
  ) : (
    <>
      <i className="ion-heart"></i> {favoritesCount}
    </>
  );

  return (
    <form action={action} className={clsx(styles["form"], className)}>
      <Button component="button" variant={favorited ? "filled" : "outline"} disabled={disabled}>
        {content}
      </Button>
    </form>
  );
};
