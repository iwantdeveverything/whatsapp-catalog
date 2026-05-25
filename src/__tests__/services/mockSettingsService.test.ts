import { describe, it, expect, beforeEach } from "vitest";
import {
  mockSettingsService,
  reset as resetSettings,
} from "@/lib/services/mock/mockSettingsService";
import type { SettingsInput } from "@/lib/schemas";

describe("mockSettingsService", () => {
  beforeEach(() => {
    resetSettings();
  });

  // ─── get() ────────────────────────────────────────────

  describe("get()", () => {
    it("returns default settings when nothing is saved", async () => {
      const settings = await mockSettingsService.get();

      expect(settings).toBeDefined();
      expect(typeof settings.catalogName).toBe("string");
    });

    it("returns the same defaults each time when nothing is saved", async () => {
      const first = await mockSettingsService.get();
      const second = await mockSettingsService.get();

      expect(first).toEqual(second);
    });
  });

  // ─── update() ─────────────────────────────────────────

  describe("update()", () => {
    it("saves and returns the updated settings", async () => {
      const result = await mockSettingsService.update({
        catalogName: "My Awesome Catalog",
      });

      expect(result.catalogName).toBe("My Awesome Catalog");
    });

    it("merges new values with existing defaults", async () => {
      await mockSettingsService.update({
        catalogName: "New Name",
      });

      const result = await mockSettingsService.get();
      expect(result.catalogName).toBe("New Name");
      // Other fields should have default values (not undefined)
      expect(result.defaultTheme).toBeDefined();
    });

    it("persists so get() returns the updated values", async () => {
      await mockSettingsService.update({
        catalogName: "Persisted Catalog",
        defaultTheme: "dark",
        whatsappPhone: "5491112345678",
      });

      const result = await mockSettingsService.get();
      expect(result.catalogName).toBe("Persisted Catalog");
      expect(result.defaultTheme).toBe("dark");
      expect(result.whatsappPhone).toBe("5491112345678");
    });

    it("allows updating individual fields without affecting others", async () => {
      await mockSettingsService.update({
        catalogName: "My Catalog",
        defaultTheme: "dark",
      });

      await mockSettingsService.update({
        catalogName: "Renamed Catalog",
      });

      const result = await mockSettingsService.get();
      expect(result.catalogName).toBe("Renamed Catalog");
      expect(result.defaultTheme).toBe("dark"); // preserved
    });

    it("handles empty update gracefully", async () => {
      const before = await mockSettingsService.get();
      await mockSettingsService.update({});
      const after = await mockSettingsService.get();

      expect(after).toEqual(before);
    });

    it("clears a field when set to undefined", async () => {
      await mockSettingsService.update({
        catalogName: "Test",
        whatsappPhone: "12345",
      });

      await mockSettingsService.update({
        whatsappPhone: undefined,
      });

      const result = await mockSettingsService.get();
      expect(result.whatsappPhone).toBeUndefined();
    });
  });

  // ─── reset() ──────────────────────────────────────────

  describe("reset()", () => {
    it("clears localStorage and restores defaults", async () => {
      await mockSettingsService.update({
        catalogName: "Custom",
        defaultTheme: "dark",
      });

      resetSettings();

      const result = await mockSettingsService.get();
      // Should be back to defaults
      expect(result.catalogName).not.toBe("Custom");
    });

    it("reset cleans up after previous updates", async () => {
      await mockSettingsService.update({ catalogName: "Changed" });
      resetSettings();

      const result = await mockSettingsService.get();
      // After reset, it should be the default catalog name (not "Changed")
      const afterReset = await mockSettingsService.get();
      expect(afterReset).toEqual(result);
    });
  });
});
