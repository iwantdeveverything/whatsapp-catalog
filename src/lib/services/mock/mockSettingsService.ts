import type { SettingsInput } from "@/lib/schemas";
import type { ISettingsService } from "@/lib/services/interfaces";

export type { ISettingsService };

// ── Constants ────────────────────────────────────────────

const STORAGE_KEY = "admin-settings";

const DEFAULTS: SettingsInput = {
  catalogName: "My Catalog",
  defaultTheme: "light",
};

// ── Service implementation ───────────────────────────────

function loadFromStorage(): SettingsInput {
  if (typeof localStorage === "undefined") return { ...DEFAULTS };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };

    const parsed = JSON.parse(raw) as SettingsInput;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveToStorage(data: SettingsInput): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const mockSettingsService: ISettingsService = {
  async get(): Promise<SettingsInput> {
    return loadFromStorage();
  },

  async update(data: SettingsInput): Promise<SettingsInput> {
    const current = loadFromStorage();
    // Merge: spread current first, then new data (so new data wins)
    const merged: SettingsInput = { ...current, ...data };
    saveToStorage(merged);
    return { ...merged };
  },
};

// ── Test isolation ───────────────────────────────────────

export function reset(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
