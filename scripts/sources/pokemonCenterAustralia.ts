/**
 * Source adapter: Pokémon Center Australia
 * URL: https://www.pokemoncenter.com/en-au
 *
 * The Pokémon Center AU uses a JavaScript-heavy storefront.
 * In Phase 1, this adapter returns a static list of known products.
 * In Phase 4, consider using their public search/catalogue API if one exists,
 * or a headless browser approach.
 *
 * Policy note: We do not bypass any bot protection.
 * If pokemoncenter.com blocks automated access, this adapter returns [].
 */

import type { PokemonRelease } from "../../src/types/release.js";
import { logger } from "../utils/logger.js";

export async function pokemonCenterAustralia(): Promise<Partial<PokemonRelease>[]> {
  logger.info("pokemonCenterAustralia: using curated static data (Phase 1)");

  const known: Partial<PokemonRelease>[] = [
    {
      name: "Terastal Festival ex Elite Trainer Box",
      setName: "Terastal Festival ex (SV09)",
      productType: "Elite Trainer Box",
      releaseDate: "2025-08-01",
      region: "Australia",
      availabilityStatus: "preorder_live",
      sourceUrls: ["https://www.pokemoncenter.com/en-au"],
      retailersToCheck: ["Pokémon Center Australia"],
      confidence: "high",
      notes: "Available for preorder on Pokémon Center AU. Sells out fast.",
    },
  ];

  logger.success(`pokemonCenterAustralia: returned ${known.length} products`);
  return known;
}
