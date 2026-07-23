import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Protected paths
  const isDashboardRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/buyer") ||
    pathname.startsWith("/dealer") ||
    pathname.startsWith("/seller");

  if (isDashboardRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/buyer/:path*",
    "/dealer/:path*",
    "/seller/:path*",
  ],
};
