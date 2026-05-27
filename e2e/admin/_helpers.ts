import type { Page } from "@playwright/test";

/**
 * Log into the admin panel via the UI. Any email and a password of length
 * ≥ 6 are accepted by the mock auth service. After successful login the
 * caller is redirected to /admin/dashboard.
 */
export async function loginAsAdmin(
  page: Page,
  email = "admin@example.com",
  password = "password123",
): Promise<void> {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /log in/i }).click();
  await page.waitForURL("**/admin/dashboard");
}

/**
 * True when running on the desktop Chromium project. Admin specs that
 * depend on the desktop layout should skip mobile projects.
 */
export function isDesktopChromium(projectName: string): boolean {
  return projectName === "chromium";
}
