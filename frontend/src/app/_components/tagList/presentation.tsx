import { Tag } from "@/modules/features/article/components/tag";

type Props = { tags: string[] };

export const TagList = ({ tags }: Props) => (
  <div className="sidebar">
    <p>Popular Tags</p>
    <div className="tag-list">
      {tags.map((tag, index) => (
        <Tag component="a" variant="filled" href={`/?tab=tag&tag=${tag}`} key={index}>
          {tag}
        </Tag>
      ))}
    </div>
  </div>
);
