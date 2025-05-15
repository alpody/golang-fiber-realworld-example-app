import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./utils/auth/session";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

const publicRoutes = [
  /^\/article\/[^\/]+?\/?$/, // /article/sample-slug
  /^\/login\/?$/,
  /^\/profile\/[^\/]+?\/?$/, // /profile/sample-username
  /^\/profile\/[^\/]+?\/favorites\/?$/, // /profile/sample-username/favorites
  /^\/register\/?$/,
  /^\/$/,
] as const;

const isPublicRoutes = (pathname: string) => {
  return publicRoutes.some((route) => route.test(pathname));
};

const isPrivateRoutes = (pathname: string) => {
  return !isPublicRoutes(pathname);
};

const middleware = async (req: NextRequest) => {
  const session = await getSession();
  if (isPrivateRoutes(req.nextUrl.pathname) && session == null) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
};

export default middleware;
