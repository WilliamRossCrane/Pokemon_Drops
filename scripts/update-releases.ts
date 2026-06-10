/**
 * update-releases.ts
 *
 * The main data update script. Run with:
 *   npm run update:releases
 *
 * What it does:
 * 1. Calls every source adapter (in scripts/sources/)
 * 2. Collects all partial product data
 * 3. Normalises each product into the PokemonRelease shape
 * 4. Deduplicates by (name + releaseDate), keeping highest confidence
 * 5. Sorts by release date ascending
 * 6. Writes the result to src/data/releases.generated.json
 *
 * Adding a new source:
 * 1. Create scripts/sources/yourSource.ts
 * 2. Export an async function returning Partial<PokemonRelease>[]
 * 3. Import it here and add it to ADAPTERS below
 */

import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import type { PokemonRelease } from "../src/types/release.js";
import { normaliseProduct, deduplicateReleases } from "./utils/normaliseProduct.js";
import { logger } from "./utils/logger.js";

// ─── Source adapters ─────────────────────────────────────────────────────────
// To add a new source, import it here and add it to the ADAPTERS array.

import { pokemonOfficial } from "./sources/pokemonOfficial.js";
import { pokemonCenterAustralia } from "./sources/pokemonCenterAustralia.js";
import { ebGames } from "./sources/ebGames.js";
import { bigW } from "./sources/bigW.js";
import { kmart } from "./sources/kmart.js";
import { target } from "./sources/target.js";
import { jbHiFi } from "./sources/jbHiFi.js";
import { goodGames } from "./sources/goodGames.js";
import { poketag } from "./sources/poketag.js";
import { wonderlandGames } from "./sources/wonderlandGames.js";

const ADAPTERS = [
  { name: "pokemonOfficial", fn: pokemonOfficial },
  { name: "pokemonCenterAustralia", fn: pokemonCenterAustralia },
  { name: "ebGames", fn: ebGames },
  { name: "bigW", fn: bigW },
  { name: "kmart", fn: kmart },
  { name: "target", fn: target },
  { name: "jbHiFi", fn: jbHiFi },
  { name: "goodGames", fn: goodGames },
  { name: "poketag", fn: poketag },
  { name: "wonderlandGames", fn: wonderlandGames },
];

// ─── Output path ─────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_PATH = resolve(__dirname, "../src/data/releases.generated.json");

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  logger.info("=== Pokémon TCG GC Tracker — Release Update Script ===");
  logger.info(`Running ${ADAPTERS.length} source adapters`);

  const allRaw: Partial<PokemonRelease>[] = [];
  const errors: string[] = [];

  // Run all adapters — failures are isolated, never crash the whole script
  for (const adapter of ADAPTERS) {
    try {
      logger.info(`Running adapter: ${adapter.name}`);
      const results = await adapter.fn();
      allRaw.push(...results);
      logger.success(`${adapter.name}: ${results.length} products`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(`${adapter.name} threw an error: ${msg}`);
      errors.push(`${adapter.name}: ${msg}`);
      // Continue with other adapters
    }
  }

  logger.info(`Total raw products collected: ${allRaw.length}`);

  // Normalise all products
  const normalised: PokemonRelease[] = allRaw
    .filter((r) => r.name && r.name.trim().length > 0)
    .map((r) => normaliseProduct(r as Partial<PokemonRelease> & { name: string }));

  // Deduplicate
  const deduped = deduplicateReleases(normalised);

  // Sort: upcoming first, then no-date, then released
  const sorted = deduped.sort((a, b) => {
    if (!a.releaseDate && !b.releaseDate) return 0;
    if (!a.releaseDate) return 1;
    if (!b.releaseDate) return -1;
    return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
  });

  // Build output
  const output = {
    generatedAt: new Date().toISOString(),
    releaseCount: sorted.length,
    errors: errors.length > 0 ? errors : undefined,
    releases: sorted,
  };

  // Write to file
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");

  logger.success(`Written ${sorted.length} releases to ${OUTPUT_PATH}`);

  if (errors.length > 0) {
    logger.warn(`${errors.length} adapter(s) had errors — see above`);
  }

  logger.info("=== Update complete ===");
}

main().catch((err) => {
  logger.error("Fatal error in update script:", err);
  process.exit(1);
});
