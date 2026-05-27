import type { SettingsInput } from "@/lib/schemas";

export interface ISettingsService {
  get(): Promise<SettingsInput>;
  update(data: SettingsInput): Promise<SettingsInput>;
}
