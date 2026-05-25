import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

describe("ConfirmDialog", () => {
  it("renders title and message when open", () => {
    render(
      <ConfirmDialog
        open
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(screen.getByText("Delete Product")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this product?"),
    ).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <ConfirmDialog
        open={false}
        title="Delete Product"
        message="Are you sure?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(screen.queryByText("Delete Product")).not.toBeInTheDocument();
  });

  it("renders confirm and cancel buttons with labels", () => {
    render(
      <ConfirmDialog
        open
        title="Delete"
        message="Are you sure?"
        confirmLabel="Yes, delete"
        cancelLabel="No, keep it"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Yes, delete" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "No, keep it" }),
    ).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmDialog
        open
        title="Delete"
        message="Are you sure?"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmDialog
        open
        title="Delete"
        message="Are you sure?"
        onConfirm={() => {}}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("uses custom confirm and cancel labels", async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmDialog
        open
        title="Delete"
        message="Are you sure?"
        confirmLabel="Delete"
        cancelLabel="Go back"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("renders as a modal dialog with accessibility attributes", () => {
    render(
      <ConfirmDialog
        open
        title="Delete"
        message="Are you sure?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );

    // The dialog should be accessible as a dialog
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});
