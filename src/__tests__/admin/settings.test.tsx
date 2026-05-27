import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsPage from "@/app/admin/settings/page";
import type { SettingsInput } from "@/lib/schemas";

// ── Mocks ──────────────────────────────────────────────────

const mockFetchSettings = vi.fn();
const mockSaveSettings = vi.fn();
const mockAddToast = vi.fn();

const mockSettingsStore = {
  settings: null as SettingsInput | null,
  loading: false,
  error: null as string | null,
  fetchSettings: mockFetchSettings,
  saveSettings: mockSaveSettings,
};

vi.mock("@/lib/stores/settingsStore", () => ({
  useSettingsStore: vi.fn(() => mockSettingsStore),
}));

vi.mock("@/components/ui/Toast", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

describe("SettingsPage", () => {
  beforeEach(() => {
    mockFetchSettings.mockClear();
    mockSaveSettings.mockReset();
    mockSaveSettings.mockResolvedValue(undefined);
    mockAddToast.mockClear();
    mockSettingsStore.settings = {
      catalogName: "Initial Catalog",
      defaultTheme: "shopify",
      whatsappPhone: "+5491111",
      whatsappTemplate: "Hi! Check {product} at {url}",
    };
    mockSettingsStore.loading = false;
    mockSettingsStore.error = null;
  });

  it("fetches settings on mount", () => {
    render(<SettingsPage />);
    expect(mockFetchSettings).toHaveBeenCalled();
  });

  it("renders all settings fields prefilled with current values", () => {
    render(<SettingsPage />);
    const name = screen.getByLabelText(/catalog name/i) as HTMLInputElement;
    const theme = screen.getByLabelText(/default theme/i) as HTMLSelectElement;
    const phone = screen.getByLabelText(/whatsapp phone/i) as HTMLInputElement;
    const tmpl = screen.getByLabelText(
      /whatsapp message template/i,
    ) as HTMLTextAreaElement;

    expect(name.value).toBe("Initial Catalog");
    expect(theme.value).toBe("shopify");
    expect(phone.value).toBe("+5491111");
    expect(tmpl.value).toBe("Hi! Check {product} at {url}");
  });

  it("populates theme dropdown with available themes from registry", () => {
    render(<SettingsPage />);
    const theme = screen.getByLabelText(/default theme/i) as HTMLSelectElement;
    // 15 themes from the registry
    expect(theme.options.length).toBeGreaterThanOrEqual(15);
    const ids = Array.from(theme.options).map((o) => o.value);
    expect(ids).toContain("shopify");
    expect(ids).toContain("claude");
    expect(ids).toContain("vercel");
  });

  it("calls saveSettings with new values when the form is submitted", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const name = screen.getByLabelText(/catalog name/i);
    await user.clear(name);
    await user.type(name, "My Store");

    const phone = screen.getByLabelText(/whatsapp phone/i);
    await user.clear(phone);
    await user.type(phone, "+5499999");

    await user.selectOptions(
      screen.getByLabelText(/default theme/i),
      "claude",
    );

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(mockSaveSettings).toHaveBeenCalledTimes(1);
    expect(mockSaveSettings).toHaveBeenCalledWith({
      catalogName: "My Store",
      defaultTheme: "claude",
      whatsappPhone: "+5499999",
      whatsappTemplate: "Hi! Check {product} at {url}",
    });
  });

  it("shows success toast after save", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: /save/i }));
    await screen.findByRole("button", { name: /save/i });

    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" }),
    );
  });

  it("shows error toast when saveSettings rejects", async () => {
    const user = userEvent.setup();
    mockSaveSettings.mockRejectedValueOnce(new Error("write failure"));
    render(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: /save/i }));
    await screen.findByRole("button", { name: /save/i });

    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    );
  });

  it("starts with empty values when store has no settings yet", () => {
    mockSettingsStore.settings = null;
    render(<SettingsPage />);
    const name = screen.getByLabelText(/catalog name/i) as HTMLInputElement;
    const phone = screen.getByLabelText(/whatsapp phone/i) as HTMLInputElement;
    expect(name.value).toBe("");
    expect(phone.value).toBe("");
  });

  it("hydrates form fields when settings load asynchronously", async () => {
    mockSettingsStore.settings = null;
    const { rerender } = render(<SettingsPage />);

    let name = screen.getByLabelText(/catalog name/i) as HTMLInputElement;
    expect(name.value).toBe("");

    mockSettingsStore.settings = {
      catalogName: "Loaded Catalog",
      defaultTheme: "linear",
      whatsappPhone: "+5400000",
      whatsappTemplate: "Tpl {product}",
    };
    rerender(<SettingsPage />);

    name = screen.getByLabelText(/catalog name/i) as HTMLInputElement;
    expect(name.value).toBe("Loaded Catalog");

    const theme = screen.getByLabelText(/default theme/i) as HTMLSelectElement;
    expect(theme.value).toBe("linear");
  });
});
