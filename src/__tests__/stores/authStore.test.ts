import { describe, it, expect, beforeEach } from "vitest";
import { reset as resetAuth } from "@/lib/services/mock/mockAuthService";
import { useAuthStore } from "@/lib/stores/authStore";

describe("authStore", () => {
  beforeEach(() => {
    resetAuth();
    // Reset store state between tests
    useAuthStore.setState({ token: null, isAuthenticated: false });
  });

  // ─── initial state ──────────────────────────────────────

  it("starts with token null and isAuthenticated false", () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  // ─── login() ────────────────────────────────────────────

  describe("login()", () => {
    it("sets token and isAuthenticated after successful login", async () => {
      await useAuthStore.getState().login("admin@test.com", "123456");

      const state = useAuthStore.getState();
      expect(state.token).toBe("mock-jwt-token");
      expect(state.isAuthenticated).toBe(true);
    });

    it("preserves the user's email via the service (document.cookie set)", async () => {
      await useAuthStore.getState().login("user@example.org", "abcdef");

      expect(document.cookie).toContain("admin-token=mock-jwt-token");
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it("accepts password with exactly 6 characters", async () => {
      await useAuthStore.getState().login("a@b.c", "123456");

      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().token).toBe("mock-jwt-token");
    });

    it("throws and does NOT set state when password is too short", async () => {
      await expect(
        useAuthStore.getState().login("admin@test.com", "12345"),
      ).rejects.toThrow("Password must be at least 6 characters");

      const state = useAuthStore.getState();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it("throws on empty password", async () => {
      await expect(
        useAuthStore.getState().login("admin@test.com", ""),
      ).rejects.toThrow();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  // ─── logout() ───────────────────────────────────────────

  describe("logout()", () => {
    it("clears token and isAuthenticated", async () => {
      await useAuthStore.getState().login("admin@test.com", "123456");
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it("clears the auth cookie via the service", async () => {
      await useAuthStore.getState().login("admin@test.com", "123456");
      expect(document.cookie).toContain("admin-token");

      useAuthStore.getState().logout();

      // jsdom removes expired cookies from document.cookie entirely
      expect(document.cookie).not.toContain("mock-jwt-token");
    });

    it("does not throw when logging out without prior login", () => {
      expect(() => useAuthStore.getState().logout()).not.toThrow();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  // ─── edge cases ─────────────────────────────────────────

  describe("edge cases", () => {
    it("login → logout → login produces correct state transitions", async () => {
      // Login
      await useAuthStore.getState().login("admin@test.com", "123456");
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Logout
      useAuthStore.getState().logout();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);

      // Login again
      await useAuthStore.getState().login("another@test.com", "654321");
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().token).toBe("mock-jwt-token");
    });

    it("failed login does not clear pre-existing auth state", async () => {
      await useAuthStore.getState().login("admin@test.com", "123456");
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Attempt failed login
      await expect(
        useAuthStore.getState().login("bad@test.com", "12345"),
      ).rejects.toThrow();

      // Auth state should still be from the previous successful login
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().token).toBe("mock-jwt-token");
    });
  });
});
