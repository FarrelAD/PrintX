/**
 * Generates a short random unique identifier string.
 * Suitable for ephemeral client-side IDs (mapping fields, etc.).
 */
export function uid(): string {
  return Math.random().toString(36).slice(2);
}
