import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/utils/slug";

describe("slugify", () => {
  it("lowercases and converts spaces to hyphens", () => {
    expect(slugify("Summer Sale")).toBe("summer-sale");
  });

  it("strips non-alphanumeric characters", () => {
    expect(slugify("Hot Drinks! & Cold (Drinks)")).toBe(
      "hot-drinks-cold-drinks",
    );
  });

  it("collapses consecutive separators to a single hyphen", () => {
    expect(slugify("Coffee   --  Tea")).toBe("coffee-tea");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("--Espresso--")).toBe("espresso");
  });

  it("normalizes accented characters", () => {
    expect(slugify("Café Latté")).toBe("cafe-latte");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("returns empty string when only special characters are passed", () => {
    expect(slugify("!!!")).toBe("");
  });
});
