"use client";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { useEffect, useState, type FormEvent } from "react";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { useToast } from "@/components/ui/Toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AVAILABLE_THEMES } from "@/lib/themes/registry";
import type { SettingsInput } from "@/lib/schemas";

interface SettingsFormValues {
  catalogName: string;
  defaultTheme: string;
  whatsappPhone: string;
  whatsappTemplate: string;
}

const emptyValues: SettingsFormValues = {
  catalogName: "",
  defaultTheme: AVAILABLE_THEMES[0]?.id ?? "",
  whatsappPhone: "",
  whatsappTemplate: "",
};

function toFormValues(settings: SettingsInput | null): SettingsFormValues {
  if (!settings) return { ...emptyValues };
  return {
    catalogName: settings.catalogName ?? "",
    defaultTheme: settings.defaultTheme ?? emptyValues.defaultTheme,
    whatsappPhone: settings.whatsappPhone ?? "",
    whatsappTemplate: settings.whatsappTemplate ?? "",
  };
}

export default function SettingsPage() {
  useDocumentTitle("Settings");
  const { settings, loading, fetchSettings, saveSettings } = useSettingsStore();
  const { addToast } = useToast();

  const [values, setValues] = useState<SettingsFormValues>(() =>
    toFormValues(settings),
  );

  // Trigger fetch on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Hydrate form fields once settings arrive from the store
  useEffect(() => {
    if (settings) {
      setValues(toFormValues(settings));
    }
  }, [settings]);

  function update<K extends keyof SettingsFormValues>(
    key: K,
    next: SettingsFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: next }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await saveSettings({
        catalogName: values.catalogName,
        defaultTheme: values.defaultTheme,
        whatsappPhone: values.whatsappPhone,
        whatsappTemplate: values.whatsappTemplate,
      });
      addToast({ type: "success", message: "Settings saved" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      addToast({ type: "error", message: msg });
    }
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      <h1 className="text-2xl font-semibold text-ink">Settings</h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 max-w-2xl"
      >
        <Input
          label="Catalog name"
          value={values.catalogName}
          onChange={(e) => update("catalogName", e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label
            htmlFor="settings-theme"
            className="text-sm font-medium text-ink"
          >
            Default theme
          </label>
          <select
            id="settings-theme"
            value={values.defaultTheme}
            onChange={(e) => update("defaultTheme", e.target.value)}
            className="rounded-md border border-hairline bg-surface1 px-3 py-2 text-ink text-base min-h-[44px]"
          >
            {AVAILABLE_THEMES.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="WhatsApp phone"
          value={values.whatsappPhone}
          onChange={(e) => update("whatsappPhone", e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label
            htmlFor="settings-template"
            className="text-sm font-medium text-ink"
          >
            WhatsApp message template
          </label>
          <textarea
            id="settings-template"
            value={values.whatsappTemplate}
            onChange={(e) => update("whatsappTemplate", e.target.value)}
            rows={4}
            className="rounded-md border border-hairline bg-surface1 px-3 py-2 text-ink text-base"
            placeholder="Hi! Check {product} at {url}"
          />
          <p className="text-xs text-muted">
            Available variables: <code>{"{product}"}</code>,{" "}
            <code>{"{url}"}</code>
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
