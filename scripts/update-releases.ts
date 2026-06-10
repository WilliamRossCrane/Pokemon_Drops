/**
 * update-releases.ts
 *
 * The main data update script.
 *
 * This script:
 * 1. Loads every source adapter from scripts/sources/
 * 2. Collects partial release objects from each adapter
 * 3. Normalises them into the shared PokemonRelease schema
 * 4. Deduplicates by name + release date, keeping the strongest confidence
 * 5. Sorts the results and writes src/data/releases.generated.json
 *
 * Each adapter should return an array of Partial<PokemonRelease> entries.
 * If a source fails, the script logs the error and continues with the others.
 */

import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import type { PokemonRelease } from "../src/types/release.js";
import { normaliseProduct, deduplicateReleases } from "./utils/index.js";
import { logger } from "./utils/index.js";
import { SOURCE_ADAPTERS } from "./sources/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_PATH = resolve(__dirname, "../src/data/releases.generated.json");

async function main() {
  logger.info("=== Pokémon TCG GC Tracker — Release Update Script ===");
  logger.info(`Running ${SOURCE_ADAPTERS.length} source adapters`);

  const allRaw: Partial<PokemonRelease>[] = [];
  const errors: string[] = [];

  for (const adapter of SOURCE_ADAPTERS) {
    try {
      logger.info(`Running adapter: ${adapter.name}`);
      const results = await adapter.fn();
      allRaw.push(...results);
      logger.success(`${adapter.name}: ${results.length} products`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`${adapter.name} threw an error: ${message}`);
      errors.push(`${adapter.name}: ${message}`);
    }
  }

  logger.info(`Total raw products collected: ${allRaw.length}`);

  const normalised: PokemonRelease[] = allRaw
    .filter((release) => release.name && release.name.trim().length > 0)
    .map((release) => normaliseProduct(release as Partial<PokemonRelease> & { name: string }));

  const deduped = deduplicateReleases(normalised);

  const sorted = deduped.sort((a, b) => {
    if (!a.releaseDate && !b.releaseDate) return 0;
    if (!a.releaseDate) return 1;
    if (!b.releaseDate) return -1;
    return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
  });

  const output = {
    generatedAt: new Date().toISOString(),
    releaseCount: sorted.length,
    errors: errors.length > 0 ? errors : undefined,
    releases: sorted,
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");

  logger.success(`Written ${sorted.length} releases to ${OUTPUT_PATH}`);

  if (errors.length > 0) {
    logger.warn(`${errors.length} adapter(s) had errors — see above`);
  }

  logger.info("=== Update complete ===");
}

main().catch((error) => {
  logger.error("Fatal error in update script:", error);
  process.exit(1);
});
