import type { PokemonRelease, Confidence } from "../../src/types/release.js";
import { logger } from "./logger.js";

const CONF_RANK: Record<Confidence, number> = { high: 3, medium: 2, low: 1 };

export function deduplicateReleases(releases: PokemonRelease[]): PokemonRelease[] {
  const map = new Map<string, PokemonRelease>();

  for (const r of releases) {
    const key = `${r.name.toLowerCase().trim()}|${r.releaseDate ?? "tbc"}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, r);
      continue;
    }

    // Merge source URLs and retailers
    const mergedSources = Array.from(new Set([...(existing.sourceUrls ?? []), ...(r.sourceUrls ?? [])]));
    const mergedRetailers = Array.from(new Set([...(existing.retailersToCheck ?? []), ...(r.retailersToCheck ?? [])]));

    // Prefer the release with higher confidence, then more complete data
    const pick = (() => {
      const a = CONF_RANK[r.confidence] ?? 0;
      const b = CONF_RANK[existing.confidence] ?? 0;
      if (a > b) return r;
      if (b > a) return existing;

      // Same confidence: prefer the one with a release date, then image, then notes
      if (r.releaseDate && !existing.releaseDate) return r;
      if (!r.releaseDate && existing.releaseDate) return existing;
      if (r.imageUrl && !existing.imageUrl) return r;
      if (!r.imageUrl && existing.imageUrl) return existing;
      if (r.notes && !existing.notes) return r;

      return existing;
    })();

    map.set(key, {
      ...pick,
      sourceUrls: mergedSources,
      retailersToCheck: mergedRetailers,
    });
  }

  const result = Array.from(map.values());
  logger.info(`Deduplication: ${releases.length} → ${result.length} releases`);
  return result;
}
