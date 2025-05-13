"use client";

import clsx from "clsx";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { ReactNode } from "react";

export const HeaderMenuItem = ({
  href,
  children,
  segment,
}: {
  href: string;
  children: ReactNode;
  segment: string | null;
}) => {
  const currentSegment = useSelectedLayoutSegment();
  const isActive = currentSegment === segment;

  return (
    <Link className={clsx("nav-link", isActive && "active")} href={href}>
      {children}
    </Link>
  );
};
