import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [ "/login", "/register", "/api/auth", "/api/register"];

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  if(pathname === "/") {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = await getToken({ req });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)).*)",
  ],
};

