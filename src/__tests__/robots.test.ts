import { describe, it, expect, beforeAll } from "vitest";
import robots from "@/app/robots";
import type { MetadataRoute } from "next";

describe("robots", () => {
  let result: MetadataRoute.Robots;

  beforeAll(() => {
    result = robots();
  });

  it("allows all crawlers by default", () => {
    expect(result.rules).toBeDefined();
    if (result.rules) {
      const rootRule = Array.isArray(result.rules)
        ? result.rules[0]
        : result.rules;
      expect(rootRule.userAgent).toBe("*");
      expect(rootRule.allow).toBe("/");
    }
  });

  it("references the sitemap URL", () => {
    expect(result.sitemap).toBeDefined();
    expect(result.sitemap).toContain("/sitemap.xml");
  });
});
