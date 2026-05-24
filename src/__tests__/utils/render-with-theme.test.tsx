import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "./render-with-theme";

describe("renderWithTheme", () => {
  it("renders content and sets default data-theme to shopify", () => {
    renderWithTheme(<p>Hello Theme</p>);

    expect(screen.getByText("Hello Theme")).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("shopify");
  });

  it("sets data-theme to the specified theme", () => {
    renderWithTheme(<p>Hello Theme</p>, { theme: "figma" });

    expect(document.documentElement.dataset.theme).toBe("figma");
  });

  it("sets data-theme to the specified dark theme", () => {
    renderWithTheme(<div>Dark mode</div>, { theme: "spotify" });

    expect(document.documentElement.dataset.theme).toBe("spotify");
    expect(screen.getByText("Dark mode")).toBeInTheDocument();
  });

  it("defaults to shopify when no options are passed", () => {
    renderWithTheme(<span>Default</span>);

    expect(document.documentElement.dataset.theme).toBe("shopify");
    expect(screen.getByText("Default")).toBeInTheDocument();
  });
});
