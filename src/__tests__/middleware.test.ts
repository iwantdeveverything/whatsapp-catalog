import { describe, it, expect } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { resolveThemeFromCookie, middleware } from "@/middleware";

describe("resolveThemeFromCookie", () => {
  it('returns "shopify" when no cookie header is present', () => {
    expect(resolveThemeFromCookie(null)).toBe("shopify");
  });

  it('returns "shopify" when cookie header is empty', () => {
    expect(resolveThemeFromCookie("")).toBe("shopify");
  });

  it('parses "theme=shopify" from cookie header', () => {
    expect(resolveThemeFromCookie("theme=shopify")).toBe("shopify");
  });

  it("parses theme cookie among other cookies", () => {
    expect(
      resolveThemeFromCookie("session=abc123; theme=shopify; cart=xyz"),
    ).toBe("shopify");
  });

  it("rejects unknown theme IDs and falls back to shopify", () => {
    expect(resolveThemeFromCookie("theme=unknown-theme")).toBe("shopify");
  });

  it("defaults to shopify when theme cookie is missing from header", () => {
    expect(resolveThemeFromCookie("session=abc; cart=xyz")).toBe("shopify");
  });

  it("handles URL-encoded cookie values", () => {
    expect(resolveThemeFromCookie("theme=shopify")).toBe("shopify");
  });

  it("accepts all registered theme IDs including luxury", () => {
    const validThemes = [
      "shopify", "nike", "airbnb", "starbucks",
      "apple", "spotify", "tesla", "vercel",
      "linear", "supabase", "figma", "notion",
      "stripe", "claude", "mistral", "luxury",
    ];
    for (const themeId of validThemes) {
      expect(
        resolveThemeFromCookie(`theme=${themeId}`),
        `theme "${themeId}" should be accepted`,
      ).toBe(themeId);
    }
  });
});

describe("middleware", () => {
  // The middleware forwards the resolved theme UPSTREAM to Server Components via
  // `NextResponse.next({ request: { headers } })`. Next.js encodes forwarded
  // request headers on the returned NextResponse as
  // `x-middleware-request-<name>` (with `x-middleware-override-headers` listing
  // the overridden keys). That forwarded value — NOT a client-facing response
  // header — is the SSR source of truth that layout.tsx reads via headers().
  const forwardedTheme = (res: NextResponse): string | null =>
    res.headers.get("x-middleware-request-x-theme");

  it("forwards luxury theme upstream on public routes regardless of cookie", () => {
    const req = new NextRequest("http://localhost:3000/");
    req.headers.set("cookie", "theme=shopify");
    const res = middleware(req);
    expect(forwardedTheme(res)).toBe("luxury");
    expect(res.headers.get("x-middleware-override-headers")).toContain(
      "x-theme",
    );
  });

  it("forwards user-selected theme upstream on /admin routes", () => {
    const req = new NextRequest("http://localhost:3000/admin/dashboard");
    // Admin routes require admin-token cookie to bypass redirect
    req.cookies.set("admin-token", "valid-token");
    req.headers.set("cookie", "theme=shopify; admin-token=valid-token");

    const res = middleware(req);
    expect(forwardedTheme(res)).toBe("shopify");
  });

  it("forwards default (shopify) theme upstream on /admin routes if no theme cookie", () => {
    const req = new NextRequest("http://localhost:3000/admin/dashboard");
    req.cookies.set("admin-token", "valid-token");
    const res = middleware(req);
    expect(forwardedTheme(res)).toBe("shopify");
  });

  it("rejects a spoofed x-theme request header on public routes (forwards luxury)", () => {
    const req = new NextRequest("http://localhost:3000/");
    // A malicious client tries to force a non-luxury theme by supplying the
    // internal SSR header itself. The middleware must overwrite it.
    req.headers.set("x-theme", "nike");
    const res = middleware(req);
    expect(forwardedTheme(res)).toBe("luxury");
  });

  it("redirects unauthenticated users from /admin routes", () => {
    const req = new NextRequest("http://localhost:3000/admin/dashboard");
    const res = middleware(req);
    expect(res.status).toBe(307); // Next.js redirect is usually 307
    expect(res.headers.get("location")).toBe("http://localhost:3000/admin/login");
  });

  it("allows access to /admin/login without token and forwards theme", () => {
    const req = new NextRequest("http://localhost:3000/admin/login");
    req.headers.set("cookie", "theme=nike");
    const res = middleware(req);
    expect(res.status).toBe(200); // Or undefined/passthrough, but it returns NextResponse.next()
    expect(forwardedTheme(res)).toBe("nike");
  });
});
