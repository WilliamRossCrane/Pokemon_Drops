/**
 * Source adapter: EB Games Australia
 * URL: https://www.ebgames.com.au
 *
 * EB Games has a public search page. This adapter attempts to fetch
 * their Pokémon TCG category page. If the request fails or returns
 * unexpected content, it falls back to curated data gracefully.
 *
 * Phase 4 TODO: parse product listings from the HTML response.
 */

import type { PokemonRelease } from "../../src/types/release.js";
import { fetchPage } from "../utils/fetchPage.js";
import { logger } from "../utils/logger.js";

// The public EB Games Pokémon TCG category page
const EB_POKEMON_URL =
  "https://www.ebgames.com.au/games/all-games?q=pokemon+tcg&platform=pokemon-trading-card-game";

export async function ebGames(): Promise<Partial<PokemonRelease>[]> {
  logger.info("ebGames: attempting to fetch public product page");

  const html = await fetchPage(EB_POKEMON_URL);

  if (!html) {
    logger.skip("ebGames", "Page fetch failed — falling back to curated data");
    return fallbackData();
  }

  // Phase 1: We have the HTML but won't parse it yet.
  // Phase 4: Add HTML parsing here using a lightweight parser (e.g. node-html-parser).
  // For now, count it as a successful fetch and return curated data.
  logger.info("ebGames: fetch succeeded — real parsing not yet implemented (Phase 1)");
  return fallbackData();
}

/** Curated fallback data for when EB Games can't be parsed. */
function fallbackData(): Partial<PokemonRelease>[] {
  return [
    {
      name: "Terastal Festival ex Elite Trainer Box",
      setName: "Terastal Festival ex (SV09)",
      productType: "Elite Trainer Box",
      releaseDate: "2025-08-01",
      region: "Australia",
      availabilityStatus: "preorder_live",
      sourceUrls: [EB_POKEMON_URL],
      retailersToCheck: ["EB Games / Zing"],
      confidence: "high",
      notes: "Preorder available at EB Games. Check online and in-store.",
    },
    {
      name: "Destined Rivals Elite Trainer Box",
      setName: "Destined Rivals (SV10)",
      productType: "Elite Trainer Box",
      releaseDate: "2025-11-07",
      region: "Australia",
      availabilityStatus: "announced",
      sourceUrls: [EB_POKEMON_URL],
      retailersToCheck: ["EB Games / Zing"],
      confidence: "medium",
    },
  ];
}
