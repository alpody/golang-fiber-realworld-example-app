import { ExhaustiveError } from "@/utils/errors";
import clsx from "clsx";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

type TagVariant = "outline" | "filled";

const variantClassNameMaps: Record<TagVariant, string> = {
  outline: "tag-outline",
  filled: "",
};

type CommonTagProps = {
  variant?: TagVariant;
};

//////////////////////////
// list item pattern

type TagPropsAsListItem = CommonTagProps &
  ComponentPropsWithoutRef<"li"> & {
    component: "li";
  };

const TagAsListItem = ({ children, variant = "filled", className, ...rest }: TagPropsAsListItem) => (
  <li className={clsx("tag-default tag-pill", className, variantClassNameMaps[variant])} {...rest}>
    {children}
  </li>
);

//////////////////////////
// anchor pattern

type TagPropsAsAnchor = CommonTagProps &
  ComponentPropsWithoutRef<"a"> & {
    component: "a";
  };

const TagAsAnchor = ({ children, variant = "filled", href = "", className, ...rest }: TagPropsAsAnchor) => (
  <Link href={href} className={clsx("tag-default tag-pill", className, variantClassNameMaps[variant])} {...rest}>
    {children}
  </Link>
);

//////////////////////////
// span pattern

type TagPropsAsSpan = CommonTagProps &
  ComponentPropsWithoutRef<"span"> & {
    component: "span";
  };

const TagAsSpan = ({ children, variant = "filled", className, ...rest }: TagPropsAsSpan) => (
  <span className={clsx("tag-default tag-pill", className, variantClassNameMaps[variant])} {...rest}>
    {children}
  </span>
);

//////////////////////////

export type TagProps = TagPropsAsListItem | TagPropsAsAnchor | TagPropsAsSpan;

export const Tag = (props: TagProps) => {
  switch (props.component) {
    case "li":
      return <TagAsListItem {...props} />;
    case "a":
      return <TagAsAnchor {...props} />;
    case "span":
      return <TagAsSpan {...props} />;
    default:
      // compilation fails if all cases are not covered
      throw new ExhaustiveError(props);
  }
};
