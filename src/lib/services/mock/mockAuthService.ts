import type { IAuthService, AuthResult } from "@/lib/services/interfaces";

export type { IAuthService };

// ── Constants ────────────────────────────────────────────

const COOKIE_NAME = "admin-token";
const MOCK_TOKEN = "mock-jwt-token";

// ── Service implementation ───────────────────────────────

export const mockAuthService: IAuthService = {
  async login(email: string, password: string): Promise<AuthResult> {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Set auth cookie
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE_NAME}=${MOCK_TOKEN}; path=/; Secure; SameSite=Strict`;
    }

    return {
      token: MOCK_TOKEN,
      user: { email },
    };
  },

  logout(): void {
    if (typeof document !== "undefined") {
      // Clear the cookie by setting max-age=0
      document.cookie = `${COOKIE_NAME}=; max-age=0; path=/`;
    }
  },
};

// ── Test isolation ───────────────────────────────────────

export function reset(): void {
  if (typeof document !== "undefined") {
    document.cookie = `${COOKIE_NAME}=; max-age=0; path=/`;
  }
}
