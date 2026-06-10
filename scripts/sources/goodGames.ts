/**
 * Source adapter: Good Games Gold Coast
 * URL: https://goodgames.com.au
 *
 * Good Games has public product pages. This adapter returns curated data for now.
 * Phase 4: Parse their public online store for Pokémon TCG listings.
 */

import type { PokemonRelease } from "../../src/types/release.js";
import { logger } from "../utils/logger.js";

export async function goodGames(): Promise<Partial<PokemonRelease>[]> {
  logger.info("goodGames: using curated data (Phase 1)");
  return [
    {
      name: "Terastal Festival ex Elite Trainer Box",
      setName: "Terastal Festival ex (SV09)",
      productType: "Elite Trainer Box",
      releaseDate: "2025-08-01",
      region: "Australia",
      availabilityStatus: "preorder_live",
      sourceUrls: ["https://goodgames.com.au"],
      retailersToCheck: ["Good Games Gold Coast"],
      confidence: "high",
    },
  ];
}
