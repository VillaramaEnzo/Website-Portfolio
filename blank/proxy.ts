import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ILY_AUTH_COOKIE_NAME,
  isIlyAuthenticated,
  isSafeIlyPath,
} from "@/lib/ilyAuth";

const PUBLIC_ILY_PATHS = new Set(["/ily/login", "/ily/auth", "/ily/unlock"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isSafeIlyPath(pathname) || PUBLIC_ILY_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const isAuthenticated = isIlyAuthenticated(
    request.cookies.get(ILY_AUTH_COOKIE_NAME)?.value,
  );

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/ily/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/ily/:path*"],
};

