import { describe, it, expect } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ToastProvider,
  ToastContainer,
  useToast,
} from "@/components/ui/Toast";
import type { ReactNode } from "react";

// Test component that uses the toast hook
function TriggerButton({ message, type }: { message: string; type: "success" | "error" }) {
  const { addToast } = useToast();
  return (
    <button onClick={() => addToast({ type, message })}>
      Trigger {type}
    </button>
  );
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  );
}

describe("Toast", () => {
  it("renders a success toast after trigger", async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <TriggerButton message="Product saved!" type="success" />
      </Wrapper>,
    );

    await user.click(screen.getByRole("button", { name: "Trigger success" }));

    expect(screen.getByText("Product saved!")).toBeInTheDocument();
  });

  it("renders an error toast after trigger", async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <TriggerButton message="Save failed" type="error" />
      </Wrapper>,
    );

    await user.click(screen.getByRole("button", { name: "Trigger error" }));

    expect(screen.getByText("Save failed")).toBeInTheDocument();
  });

  it("auto-dismisses toast after ~3 seconds", async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <TriggerButton message="Will dismiss" type="success" />
      </Wrapper>,
    );

    await user.click(screen.getByRole("button", { name: "Trigger success" }));
    expect(screen.getByText("Will dismiss")).toBeInTheDocument();

    // Wait for auto-dismiss (3 seconds + some buffer)
    await waitFor(
      () => {
        expect(screen.queryByText("Will dismiss")).not.toBeInTheDocument();
      },
      { timeout: 4000 },
    );
  });

  it("supports multiple toasts stacking", async () => {
    const user = userEvent.setup();

    function MultiTrigger() {
      const { addToast } = useToast();
      return (
        <div>
          <button onClick={() => addToast({ type: "success", message: "Toast 1" })}>
            Toast 1
          </button>
          <button onClick={() => addToast({ type: "error", message: "Toast 2" })}>
            Toast 2
          </button>
        </div>
      );
    }

    render(
      <Wrapper>
        <MultiTrigger />
      </Wrapper>,
    );

    await user.click(screen.getByRole("button", { name: "Toast 1" }));
    await user.click(screen.getByRole("button", { name: "Toast 2" }));

    // Both toast messages appear in the toast container
    const toasts = screen.getAllByRole("alert");
    expect(toasts).toHaveLength(2);
    expect(toasts[0]).toHaveTextContent("Toast 1");
    expect(toasts[1]).toHaveTextContent("Toast 2");
  });

  it("allows manual dismissal of a toast", async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <TriggerButton message="Dismiss me" type="success" />
      </Wrapper>,
    );

    await user.click(screen.getByRole("button", { name: "Trigger success" }));
    expect(screen.getByText("Dismiss me")).toBeInTheDocument();

    const dismissButton = screen.getByRole("button", { name: "Dismiss" });
    await user.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByText("Dismiss me")).not.toBeInTheDocument();
    });
  });

  it("caller outside ToastProvider throws error", () => {
    function BadCaller() {
      useToast();
      return null;
    }

    expect(() => render(<BadCaller />)).toThrow(
      "useToast must be used within a ToastProvider",
    );
  });
});
