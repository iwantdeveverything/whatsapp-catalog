import { describe, it, expect, beforeEach } from "vitest";
import { reset as resetSettings } from "@/lib/services/mock/mockSettingsService";
import { useSettingsStore } from "@/lib/stores/settingsStore";

describe("settingsStore", () => {
  beforeEach(() => {
    resetSettings();
    useSettingsStore.setState({ settings: null, loading: false, error: null });
  });

  // ─── initial state ──────────────────────────────────────

  it("starts with null settings, loading false, error null", () => {
    const state = useSettingsStore.getState();
    expect(state.settings).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  // ─── fetchSettings() ────────────────────────────────────

  describe("fetchSettings()", () => {
    it("loads settings from the service", async () => {
      await useSettingsStore.getState().fetchSettings();

      const state = useSettingsStore.getState();
      expect(state.settings).not.toBeNull();
      expect(state.settings!.catalogName).toBe("My Catalog");
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("sets loading true while fetching", async () => {
      const fetchPromise = useSettingsStore.getState().fetchSettings();
      expect(useSettingsStore.getState().loading).toBe(true);

      await fetchPromise;
      expect(useSettingsStore.getState().loading).toBe(false);
    });
  });

  // ─── saveSettings() ─────────────────────────────────────

  describe("saveSettings()", () => {
    it("saves settings and updates the store state", async () => {
      await useSettingsStore.getState().saveSettings({
        catalogName: "Mi Catálogo",
        defaultTheme: "dark",
      });

      const settings = useSettingsStore.getState().settings;
      expect(settings).not.toBeNull();
      expect(settings!.catalogName).toBe("Mi Catálogo");
      expect(settings!.defaultTheme).toBe("dark");
      expect(useSettingsStore.getState().loading).toBe(false);
    });

    it("preserves unchanged fields during merge", async () => {
      // Set initial settings
      await useSettingsStore.getState().saveSettings({
        catalogName: "Initial",
        defaultTheme: "light",
      });

      // Save only one field
      await useSettingsStore.getState().saveSettings({
        catalogName: "Updated",
      });

      const settings = useSettingsStore.getState().settings;
      expect(settings!.catalogName).toBe("Updated");
      expect(settings!.defaultTheme).toBe("light"); // preserved from merge
    });

    it("sets loading true while saving", async () => {
      const savePromise = useSettingsStore.getState().saveSettings({
        catalogName: "Test",
      });
      expect(useSettingsStore.getState().loading).toBe(true);

      await savePromise;
      expect(useSettingsStore.getState().loading).toBe(false);
    });
  });

  // ─── full flow ──────────────────────────────────────────

  describe("full flow", () => {
    it("fetch → update → fetch shows persisted data", async () => {
      await useSettingsStore.getState().saveSettings({
        catalogName: "Persisted Catalog",
      });

      // Reset store and re-fetch
      useSettingsStore.setState({ settings: null });
      await useSettingsStore.getState().fetchSettings();

      expect(useSettingsStore.getState().settings!.catalogName).toBe(
        "Persisted Catalog",
      );
    });
  });
});
