import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/admin/login/page";

const mockPush = vi.fn();
const mockLogin = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/login",
}));

vi.mock("@/lib/stores/authStore", () => ({
  useAuthStore: (selector: (s: { login: typeof mockLogin; logout: ReturnType<typeof vi.fn>; token: null; isAuthenticated: boolean }) => unknown) =>
    selector({
      login: mockLogin,
      logout: vi.fn(),
      token: null,
      isAuthenticated: false,
    }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue(undefined);
  });

  it("renders email and password fields and submit button", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty submission", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/too small/i)).toBeInTheDocument();
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.type(screen.getByLabelText(/password/i), "validpassword");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for short password", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "12345");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/too small/i)).toBeInTheDocument();
    });
  });

  it("calls authStore.login and redirects on valid submission", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "validpass");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("admin@example.com", "validpass");
      expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("shows loading state during submission", async () => {
    let resolveLogin!: () => void;
    mockLogin.mockReturnValue(new Promise<void>((r) => { resolveLogin = r; }));

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "validpass");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /log in/i })).toBeDisabled();
    });

    resolveLogin();
  });

  it("shows error message on login failure", async () => {
    mockLogin.mockRejectedValue(new Error("Invalid credentials"));

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "validpass");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});