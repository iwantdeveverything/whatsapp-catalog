import { describe, it, expect, beforeAll } from "vitest";
import manifest from "@/app/manifest";
import type { MetadataRoute } from "next";

describe("manifest", () => {
  let result: MetadataRoute.Manifest;

  beforeAll(() => {
    result = manifest();
  });

  it("has a name and short_name", () => {
    expect(result.name).toBe("Catálogo Digital");
    expect(result.short_name).toBeDefined();
    expect(result.short_name!.length).toBeLessThanOrEqual(12);
  });

  it("sets display to standalone for PWA", () => {
    expect(result.display).toBe("standalone");
  });

  it('sets start_url to "/"', () => {
    expect(result.start_url).toBe("/");
  });

  it("includes a theme_color and background_color", () => {
    expect(result.theme_color).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(result.background_color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("includes icons at 192px and 512px", () => {
    expect(result.icons).toBeDefined();
    expect(result.icons!.length).toBeGreaterThanOrEqual(2);

    const icon192 = result.icons!.find((i) => (i.sizes ?? "").includes("192"));
    const icon512 = result.icons!.find((i) => (i.sizes ?? "").includes("512"));

    expect(icon192).toBeDefined();
    expect(icon192!.src).toBeDefined();
    expect(icon192!.type).toBe("image/png");

    expect(icon512).toBeDefined();
    expect(icon512!.src).toBeDefined();
    expect(icon512!.type).toBe("image/png");
  });
});
