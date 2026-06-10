/**
 * Parse a loose date string into an ISO date string (YYYY-MM-DD).
 * Returns undefined if the date cannot be reliably parsed.
 *
 * Handles formats like:
 *   "August 1, 2025"
 *   "01/08/2025"    (AU format DD/MM/YYYY)
 *   "2025-08-01"
 *   "Aug 2025"      → first of month
 */
export function parseDate(raw: string | undefined | null): string | undefined {
  if (!raw) return undefined;

  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  // Already ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  // DD/MM/YYYY (AU format)
  const ddmmyyyy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const [, d, m, y] = ddmmyyyy;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  // "Month YYYY" → treat as 1st of month
  const monthYear = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const d = new Date(`${monthYear[1]} 1, ${monthYear[2]}`);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
  }

  // Natural language: "August 1, 2025"
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }

  return undefined;
}

/** Return today as ISO date string, in AEST (UTC+10). */
export function todayAEST(): string {
  const now = new Date();
  // Offset to UTC+10
  const aest = new Date(now.getTime() + 10 * 60 * 60 * 1000);
  return aest.toISOString().split("T")[0];
}

/** Returns true if the ISO date string is in the future. */
export function isFuture(isoDate: string | undefined): boolean {
  if (!isoDate) return false;
  return new Date(isoDate) > new Date();
}
