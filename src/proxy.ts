import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getSiteSettings } from "@/lib/settings";

const PUBLIC_PATHS = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

const PUBLIC_API_PATHS = [
  "/api/admin/forgot-password",
  "/api/admin/reset-password",
];

async function handleAdmin(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    const session = await auth();
    if (session) {
      return NextResponse.redirect(new URL("/admin/blog", request.url));
    }
    return NextResponse.next();
  }

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return handleAdmin(request);
  }

  // robots.txt et sitemap.xml restent servis normalement pendant la maintenance :
  // les réécrire en page HTML brouillerait les robots d'indexation.
  if (
    pathname === "/maintenance" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const settings = await getSiteSettings();
  if (settings.maintenanceMode) {
    const session = await auth();
    if (!session) {
      // 503 + Retry-After : indique aux moteurs que l'arrêt est temporaire
      // (un 200 ferait indexer la page de maintenance à la place du contenu).
      return NextResponse.rewrite(new URL("/maintenance", request.url), {
        status: 503,
        headers: { "Retry-After": "3600" },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
