import { describe, it, expect } from "vitest";
import { resolveThemeFromCookie } from "@/middleware";

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
});
