import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("renders label and input with htmlFor/id linking", () => {
    render(<Input label="Email" id="email" />);
    const label = screen.getByText("Email");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "email");

    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "email");
  });

  it("renders error message when error prop is provided", () => {
    render(<Input label="Email" error="Email is required" />);
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("does not render error when no error prop", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("forwards ref to the input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Name" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.tagName).toBe("INPUT");
  });

  it("accepts placeholder text", () => {
    render(<Input label="Email" placeholder="Enter your email" />);
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
  });

  it("accepts user text input", async () => {
    const user = userEvent.setup();
    render(<Input label="Name" />);

    const input = screen.getByLabelText("Name");
    await user.type(input, "John Doe");

    expect(input).toHaveValue("John Doe");
  });

  it("renders as a password input when type is password", () => {
    render(<Input label="Password" type="password" />);
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
  });

  it("renders as a number input when type is number", () => {
    render(<Input label="Price" type="number" />);
    const input = screen.getByLabelText("Price");
    expect(input).toHaveAttribute("type", "number");
  });

  it("merges custom className with base styles", () => {
    render(<Input label="Test" className="custom-input" />);
    const input = screen.getByLabelText("Test");
    expect(input.className).toContain("custom-input");
  });

  it("associates error message with input via aria-describedby", () => {
    render(<Input label="Email" id="email" error="Invalid email" />);
    const input = screen.getByLabelText("Email");
    const errorEl = screen.getByText("Invalid email");
    expect(input).toHaveAttribute("aria-describedby", errorEl.id);
  });
});
