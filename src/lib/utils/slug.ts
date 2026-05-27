/**
 * Deterministic slug generator for category names and similar inputs.
 *
 * - Lowercases the input
 * - Strips diacritics (e.g. é → e)
 * - Replaces any run of non-alphanumeric characters with a single hyphen
 * - Trims leading and trailing hyphens
 *
 * Pure function — same input always produces the same output.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
