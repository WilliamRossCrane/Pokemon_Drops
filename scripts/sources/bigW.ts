/**
 * Source adapter: Big W Australia
 *
 * Big W's website uses bot protection that blocks automated access.
 * This adapter returns curated/known data only.
 *
 * Phase 4 TODO: Monitor if Big W adds a public product RSS or JSON endpoint.
 */

import type { PokemonRelease } from "../../src/types/release.js";
import { logger } from "../utils/logger.js";

export async function bigW(): Promise<Partial<PokemonRelease>[]> {
  logger.skip("bigW", "Site uses bot protection — using curated data only");

  return [
    {
      name: "Terastal Festival ex Booster Bundle",
      setName: "Terastal Festival ex (SV09)",
      productType: "Booster Bundle",
      releaseDate: "2025-08-01",
      region: "Australia",
      availabilityStatus: "announced",
      sourceUrls: ["https://www.bigw.com.au"],
      retailersToCheck: ["Big W"],
      confidence: "medium",
      notes: "Big W typically stocks booster bundles and ETBs on launch day. Check in-store.",
    },
  ];
}
