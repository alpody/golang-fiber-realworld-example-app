import { fetchTagsList } from "@/modules/features/article/fetch/fetchTagsList";
import { TagList as TagListPresentation } from "./presentation";

export const TagList = async () => {
  const tags = await fetchTagsList();
  return <TagListPresentation tags={tags} />;
};
