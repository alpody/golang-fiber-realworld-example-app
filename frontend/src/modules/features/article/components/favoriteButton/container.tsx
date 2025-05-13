"use client";

import { useActionState } from "react";
import { favoriteAction } from "./action";
import { FavoriteButton as FavoriteButtonPresentation } from "./presentation";

type Props = {
  slug: string;
  favorited: boolean;
  favoritesCount: number;
  showMessage?: boolean;
  className?: string;
};

export const FavoriteButton = ({ slug, favorited, favoritesCount, showMessage, className }: Props) => {
  const [state, action, isPending] = useActionState(favoriteAction, {
    favorited,
    favoritesCount,
  });

  return (
    <FavoriteButtonPresentation
      {...state}
      action={() => action(slug)}
      disabled={isPending}
      showMessage={showMessage}
      className={className}
    />
  );
};
