import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"footer">;

export const Footer = (props: Props) => (
  <footer {...props}>
    <div className="container">
      <Link href="/" className="logo-font">
        conduit
      </Link>
      <span className="attribution">
        An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed
        under MIT.
      </span>
    </div>
  </footer>
);
