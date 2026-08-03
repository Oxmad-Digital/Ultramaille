import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const PUBLIC_PATHS = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

const PUBLIC_API_PATHS = [
  "/api/admin/forgot-password",
  "/api/admin/reset-password",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname) || PUBLIC_API_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const session = await auth();
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
