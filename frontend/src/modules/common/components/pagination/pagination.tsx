import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";

type PaginationItemProps = ComponentPropsWithoutRef<"li"> & {
  href?: string;
  active?: boolean;
};

export const PaginationItem = ({ href, active, className, children, ...rest }: PaginationItemProps) => (
  <li className={clsx("page-item", className, active && "active")} {...rest}>
    <a className="page-link" href={href}>
      {children}
    </a>
  </li>
);

type PaginationProps = ComponentPropsWithoutRef<"ul">;

export const Pagination = ({ className, children, ...rest }: PaginationProps) =>
  children && (
    <ul className={clsx("pagination", className)} {...rest}>
      {children}
    </ul>
  );
