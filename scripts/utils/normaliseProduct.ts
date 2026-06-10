/**
 * Normalises a partial/raw product object into a full PokemonRelease.
 * All source adapters return Partial<PokemonRelease> — this fills in defaults.
 */

import type { PokemonRelease, ProductType, AvailabilityStatus } from "../../src/types/release.js";
import { parseDate } from "./dateUtils.js";
import { logger } from "./logger.js";

// Crude but useful: guess product type from name if not supplied
function inferProductType(name: string): ProductType {
  const n = name.toLowerCase();
  if (n.includes("elite trainer") || n.includes("etb")) return "Elite Trainer Box";
  if (n.includes("booster box")) return "Booster Box";
  if (n.includes("booster bundle")) return "Booster Bundle";
  if (n.includes("collection box")) return "Collection Box";
  if (n.includes("premium collection")) return "Premium Collection";
  if (n.includes("tin")) return "Tin";
  if (n.includes("deck") || n.includes("starter")) return "Deck";
  return "Other";
}

export function normaliseProduct(
  raw: Partial<PokemonRelease> & { name: string }
): PokemonRelease {
  const now = new Date().toISOString();

  const productType: ProductType =
    raw.productType ?? inferProductType(raw.name);

  const releaseDate = parseDate(raw.releaseDate);
  const preorderDate = parseDate(raw.preorderDate);

  // Derive a stable id from name + release date if not provided
  const id =
    raw.id ??
    `${raw.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${releaseDate ?? "tbc"}`;

  // If release date is in the past and status wasn't explicitly set,
  // mark as released
  let status: AvailabilityStatus = raw.availabilityStatus ?? "unknown";
  if (!raw.availabilityStatus && releaseDate) {
    const releaseMs = new Date(releaseDate).getTime();
    status = releaseMs < Date.now() ? "released" : "announced";
  }

  return {
    id,
    name: raw.name,
    setName: raw.setName,
    productType,
    releaseDate,
    preorderDate,
    region: raw.region ?? "Australia",
    availabilityStatus: status,
    imageUrl: raw.imageUrl,
    sourceUrls: raw.sourceUrls ?? [],
    retailersToCheck: raw.retailersToCheck ?? [],
    confidence: raw.confidence ?? "low",
    notes: raw.notes,
    lastChecked: now,
  };
}

/** Deduplicate a list of releases by (name + releaseDate), keeping highest confidence. */
export function deduplicateReleases(releases: PokemonRelease[]): PokemonRelease[] {
  const CONF_RANK: Record<string, number> = { high: 3, medium: 2, low: 1 };
  const map = new Map<string, PokemonRelease>();

  for (const r of releases) {
    const key = `${r.name.toLowerCase().trim()}|${r.releaseDate ?? "tbc"}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, r);
    } else {
      // Keep higher confidence; merge source URLs
      const mergedSources = Array.from(
        new Set([...existing.sourceUrls, ...r.sourceUrls])
      );
      if ((CONF_RANK[r.confidence] ?? 0) > (CONF_RANK[existing.confidence] ?? 0)) {
        map.set(key, { ...r, sourceUrls: mergedSources });
      } else {
        map.set(key, { ...existing, sourceUrls: mergedSources });
      }
    }
  }

  const result = Array.from(map.values());
  logger.info(`Deduplication: ${releases.length} → ${result.length} releases`);
  return result;
}
