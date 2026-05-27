import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "@/components/ui/Modal";

describe("Modal", () => {
  // RTL's cleanup handles portal removal automatically

  it("renders when open is true", () => {
    render(
      <Modal open onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <Modal open={false} onClose={() => {}} title="Hidden Modal">
        <p>Should not appear</p>
      </Modal>,
    );

    expect(screen.queryByText("Hidden Modal")).not.toBeInTheDocument();
  });

  it("renders footer content when provided", () => {
    render(
      <Modal
        open
        onClose={() => {}}
        title="With Footer"
        footer={<button>Cancel</button>}
      >
        <p>Body</p>
      </Modal>,
    );

    expect(screen.getByText("With Footer")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("calls onClose when Escape key is pressed", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal open onClose={onClose} title="Esc Test">
        <p>Content</p>
      </Modal>,
    );

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay backdrop is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal open onClose={onClose} title="Overlay Test">
        <p>Content</p>
      </Modal>,
    );

    // The backdrop is the outermost overlay div
    const backdrop = document.querySelector("[data-modal-backdrop]");
    expect(backdrop).not.toBeNull();

    if (backdrop) {
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it("does not close when clicking inside the modal content", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal open onClose={onClose} title="Content Click">
        <p>Inner content</p>
      </Modal>,
    );

    await user.click(screen.getByText("Inner content"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders close button that calls onClose", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal open onClose={onClose} title="Closable">
        <p>Content</p>
      </Modal>,
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("focuses the first focusable element when opened", async () => {
    render(
      <Modal open onClose={() => {}} title="Focus Test">
        <button>First Action</button>
      </Modal>,
    );

    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "First Action" }),
      );
    });
  });

  it("traps focus within the modal", async () => {
    const user = userEvent.setup();

    render(
      <Modal open onClose={() => {}} title="Focus Trap">
        <button>First</button>
        <button>Last</button>
      </Modal>,
    );

    const firstButton = screen.getByRole("button", { name: "First" });
    const lastButton = screen.getByRole("button", { name: "Last" });
    const closeButton = screen.getByRole("button", { name: /close/i });

    // Start at the first button
    firstButton.focus();
    expect(document.activeElement).toBe(firstButton);

    // Tab forward from First → Last (close is before First in DOM)
    await user.tab();
    expect(document.activeElement).toBe(lastButton);

    // Tab forward from Last → wraps to close button
    await user.tab();
    expect(document.activeElement).toBe(closeButton);

    // Tab forward from close → First
    await user.tab();
    expect(document.activeElement).toBe(firstButton);
  });

  it("does not call onClose when Escape is pressed and modal is closed", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal open={false} onClose={onClose} title="Closed">
        <p>Content</p>
      </Modal>,
    );

    await user.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });
});
