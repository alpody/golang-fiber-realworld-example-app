import { Button, Color } from "@/modules/common/components/button";
import styles from "./presentation.module.css";
import clsx from "clsx";

type Props = {
  username: string;
  color?: Color;
  following?: boolean;
  action?: () => void;
  isPending?: boolean;
  className?: string;
};

export const FollowButton = ({ username, color, following, action, isPending, className }: Props) => {
  return (
    <form action={action} className={clsx(className, styles["form"])}>
      <Button
        component="button"
        type="submit"
        className="action-btn"
        color={color}
        variant={following ? "filled" : "outline"}
        disabled={isPending}
      >
        <i className="ion-plus-round"></i> {following ? "Unfollow" : "Follow"} {username}
      </Button>
    </form>
  );
};
