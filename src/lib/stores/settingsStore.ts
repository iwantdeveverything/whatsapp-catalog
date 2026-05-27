import { create } from "zustand";
import { mockSettingsService } from "@/lib/services/mock/mockSettingsService";
import type { SettingsInput } from "@/lib/schemas";

interface SettingsState {
  settings: SettingsInput | null;
  loading: boolean;
  error: string | null;

  fetchSettings: () => Promise<void>;
  saveSettings: (data: SettingsInput) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const settings = await mockSettingsService.get();
      set({ settings, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  saveSettings: async (data: SettingsInput) => {
    set({ loading: true, error: null });
    try {
      const settings = await mockSettingsService.update(data);
      set({ settings, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },
}));
