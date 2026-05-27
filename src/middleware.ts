import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_THEME } from "@/lib/themes/types";

/** Themes that are allowed to be set via cookie. */
const ALLOWED_THEMES: string[] = [
  "shopify",
  "nike",
  "airbnb",
  "starbucks",
  "apple",
  "spotify",
  "tesla",
  "vercel",
  "linear",
  "supabase",
  "figma",
  "notion",
  "stripe",
  "claude",
  "mistral",
];

/**
 * Extracts and validates the theme ID from a cookie header string.
 * Falls back to DEFAULT_THEME ("shopify") when cookie is missing or invalid.
 */
export function resolveThemeFromCookie(cookieHeader: string | null): string {
  if (!cookieHeader) return DEFAULT_THEME;

  const match = cookieHeader.match(/(?:^|;\s*)theme=([^;]+)/);
  if (!match) return DEFAULT_THEME;

  const themeId = decodeURIComponent(match[1]);
  if (ALLOWED_THEMES.includes(themeId)) return themeId;

  return DEFAULT_THEME;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/") && pathname !== "/admin/login") {
    const adminToken = request.cookies.get("admin-token")?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  const cookieHeader = request.headers.get("cookie");
  const theme = resolveThemeFromCookie(cookieHeader);

  const response = NextResponse.next();
  response.headers.set("x-theme", theme);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
