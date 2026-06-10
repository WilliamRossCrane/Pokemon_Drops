/**
 * Safe HTTP fetch helper for the data update scripts.
 *
 * Rules:
 * - Uses a clear User-Agent identifying this project
 * - Adds a small delay before each request (configurable)
 * - Returns null on any error rather than throwing — callers handle gracefully
 * - Does NOT bypass CAPTCHAs, bot protection, or logins
 * - If a site blocks access, we log it and return null
 */

import { logger } from "./logger.js";

const USER_AGENT =
  "pokemon-tcg-gc-tracker/1.0 (public data only; https://github.com/yourname/pokemon-tcg-gold-coast-tracker)";

const DEFAULT_DELAY_MS = 1500; // 1.5 seconds between requests

/** Sleep for ms milliseconds. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch a public URL as text. Returns null if anything goes wrong. */
export async function fetchPage(
  url: string,
  delayMs: number = DEFAULT_DELAY_MS
): Promise<string | null> {
  await sleep(delayMs);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-AU,en;q=0.9",
      },
      signal: AbortSignal.timeout(15_000), // 15s timeout
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        logger.skip(url, `Blocked (HTTP ${response.status}) — skipping this source`);
      } else {
        logger.warn(`HTTP ${response.status} for ${url}`);
      }
      return null;
    }

    const text = await response.text();
    logger.success(`Fetched ${url} (${text.length} bytes)`);
    return text;
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      logger.warn(`Timeout fetching ${url}`);
    } else {
      logger.error(`Failed to fetch ${url}`, err);
    }
    return null;
  }
}

/** Fetch JSON from a public URL. Returns null on failure. */
export async function fetchJson<T = unknown>(
  url: string,
  delayMs: number = DEFAULT_DELAY_MS
): Promise<T | null> {
  await sleep(delayMs);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
        "Accept-Language": "en-AU,en;q=0.9",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      logger.warn(`HTTP ${response.status} fetching JSON from ${url}`);
      return null;
    }

    const data = (await response.json()) as T;
    logger.success(`Fetched JSON from ${url}`);
    return data;
  } catch (err) {
    logger.error(`Failed to fetch JSON from ${url}`, err);
    return null;
  }
}
