import { describe, it, expect, vi } from "vitest";

// Mock next/og before importing the opengraph module
const mockImageResponse = vi.fn();
vi.mock("next/og", () => ({
  ImageResponse: class {
    constructor(...args: unknown[]) {
      mockImageResponse(...args);
    }
  },
}));

describe("opengraph-image", () => {
  it("exports the correct size constants (1200×630)", async () => {
    const mod = await import("@/app/[productId]/opengraph-image");
    expect(mod.size).toEqual({ width: 1200, height: 630 });
  });

  it("exports the correct contentType", async () => {
    const mod = await import("@/app/[productId]/opengraph-image");
    expect(mod.contentType).toBe("image/png");
  });

  it("generates an ImageResponse for an existing product", async () => {
    mockImageResponse.mockClear();
    const mod = await import("@/app/[productId]/opengraph-image");
    await mod.default({
      params: { productId: "zapatillas-running" },
    });
    expect(mockImageResponse).toHaveBeenCalledTimes(1);
  });

  it("generates a fallback ImageResponse when product not found", async () => {
    mockImageResponse.mockClear();
    const mod = await import("@/app/[productId]/opengraph-image");
    await mod.default({
      params: { productId: "nonexistent-product" },
    });
    expect(mockImageResponse).toHaveBeenCalledTimes(1);
  });

  it("does not throw for non-existent products (graceful fallback)", async () => {
    const mod = await import("@/app/[productId]/opengraph-image");
    await expect(
      mod.default({
        params: { productId: "nonexistent-product" },
      }),
    ).resolves.toBeDefined();
  });
});
