import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InstallBanner } from "@/components/install-banner";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("InstallBanner", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  // --- Rendering ---

  it("is hidden by default when no beforeinstallprompt event has fired", () => {
    const { container } = render(<InstallBanner />);
    expect(container.firstChild).toBeNull();
  });

  it("shows the banner after the beforeinstallprompt event fires", () => {
    render(<InstallBanner />);

    // Simulate the event
    const event = new Event("beforeinstallprompt") as Event & {
      prompt: () => Promise<void>;
    };
    Object.assign(event, { prompt: vi.fn() });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(screen.getByText(/agregar.*inicio/i)).toBeInTheDocument();
  });

  it("renders an install button", () => {
    render(<InstallBanner />);

    const event = new Event("beforeinstallprompt") as Event & {
      prompt: () => Promise<void>;
    };
    Object.assign(event, { prompt: vi.fn() });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(
      screen.getByRole("button", { name: /instalar/i }),
    ).toBeInTheDocument();
  });

  it("renders a dismiss button", () => {
    render(<InstallBanner />);

    const event = new Event("beforeinstallprompt") as Event & {
      prompt: () => Promise<void>;
    };
    Object.assign(event, { prompt: vi.fn() });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(screen.getByRole("button", { name: /cerrar/i })).toBeInTheDocument();
  });

  // --- Dismiss behavior ---

  it("hides the banner when dismiss button is clicked", async () => {
    render(<InstallBanner />);

    const event = new Event("beforeinstallprompt") as Event & {
      prompt: () => Promise<void>;
    };
    Object.assign(event, { prompt: vi.fn() });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(screen.getByText(/agregar.*inicio/i)).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /cerrar/i }));

    expect(screen.queryByText(/agregar.*inicio/i)).not.toBeInTheDocument();
  });

  // --- Prompt event ---

  it("calls prompt() when install button is clicked", async () => {
    const promptMock = vi.fn();
    render(<InstallBanner />);

    const event = new Event("beforeinstallprompt") as Event & {
      prompt: () => Promise<void>;
    };
    Object.assign(event, { prompt: promptMock });

    act(() => {
      window.dispatchEvent(event);
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /instalar/i }));

    expect(promptMock).toHaveBeenCalled();
  });

  // --- Visit tracking ---

  it("persists dismissal to localStorage", async () => {
    render(<InstallBanner />);

    const event = new Event("beforeinstallprompt") as Event & {
      prompt: () => Promise<void>;
    };
    Object.assign(event, { prompt: vi.fn() });

    act(() => {
      window.dispatchEvent(event);
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /cerrar/i }));

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "pwa-banner-dismissed",
      expect.any(String),
    );
  });

  it("does not show banner if previously dismissed", () => {
    localStorageMock.getItem.mockReturnValue("true");

    render(<InstallBanner />);

    const event = new Event("beforeinstallprompt") as Event & {
      prompt: () => Promise<void>;
    };
    Object.assign(event, { prompt: vi.fn() });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(screen.queryByText(/agregar.*inicio/i)).not.toBeInTheDocument();
  });
});
