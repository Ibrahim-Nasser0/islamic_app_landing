import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  isValidLocale,
  LOCALE_COOKIE_NAME,
} from "@/lib/i18n";

const PUBLIC_FILE_RE = /\.[^/]+$/;

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip Next.js internals, API endpoints, admin panel, SEO files, and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE_RE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  // Canonicalize explicit /ar prefix back to clean root paths ("/", "/about", etc.)
  if (firstSegment === DEFAULT_LOCALE) {
    const rest = segments.slice(1).join("/");
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.pathname = rest ? `/${rest}` : "/";
    cleanUrl.search = search;
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(LOCALE_COOKIE_NAME, DEFAULT_LOCALE, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  // English routes stay under /en/*
  if (isValidLocale(firstSegment)) {
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE_NAME)?.value !== firstSegment) {
      response.cookies.set(LOCALE_COOKIE_NAME, firstSegment, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  // Primary Arabic pages live on root URLs ("/", "/about", "/guide", "/privacy")
  // Internally rewrite to /ar/* while keeping the address bar clean
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname =
    pathname === "/" ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`;
  rewriteUrl.search = search;

  const response = NextResponse.rewrite(rewriteUrl);
  if (request.cookies.get(LOCALE_COOKIE_NAME)?.value !== DEFAULT_LOCALE) {
    response.cookies.set(LOCALE_COOKIE_NAME, DEFAULT_LOCALE, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
