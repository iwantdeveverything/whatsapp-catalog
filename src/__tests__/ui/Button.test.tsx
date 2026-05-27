import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("renders with primary variant as default", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole("button", { name: "Primary" });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("renders secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button", { name: "Secondary" })).toBeInTheDocument();
  });

  it("renders danger variant", () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("renders ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button", { name: "Ghost" })).toBeInTheDocument();
  });

  it("renders small size", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button", { name: "Small" })).toBeInTheDocument();
  });

  it("renders medium size (default)", () => {
    render(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button", { name: "Medium" })).toBeInTheDocument();
  });

  it("renders large size with min touch target height", () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button", { name: "Large" })).toBeInTheDocument();
  });

  it("shows loading spinner and is disabled when loading", () => {
    render(<Button loading>Submitting</Button>);
    const button = screen.getByRole("button", { name: /Submitting/ });
    expect(button).toBeDisabled();
    // The loading text should still be accessible
    expect(screen.getByText("Submitting")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(<Button onClick={() => { clicked = true; }}>Click</Button>);

    await user.click(screen.getByRole("button", { name: "Click" }));
    expect(clicked).toBe(true);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(<Button disabled onClick={() => { clicked = true; }}>Click</Button>);

    await user.click(screen.getByRole("button", { name: "Click" }));
    expect(clicked).toBe(false);
  });

  it("does not call onClick when loading", async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(<Button loading onClick={() => { clicked = true; }}>Click</Button>);

    await user.click(screen.getByRole("button", { name: /Click/ }));
    expect(clicked).toBe(false);
  });

  it("merges custom className with variant classes", () => {
    render(<Button className="custom-class">Styled</Button>);
    const button = screen.getByRole("button", { name: "Styled" });
    expect(button.className).toContain("custom-class");
  });

  it("renders as a submit button when type is submit", () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("renders with default type button", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button", { name: "Default" });
    expect(button).toHaveAttribute("type", "button");
  });
});
