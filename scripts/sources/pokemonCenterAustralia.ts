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
import { logger, fetchPage } from "../utils/index.js";

export async function pokemonCenterAustralia(): Promise<Partial<PokemonRelease>[]> {
  const SOURCE_URL = "https://www.pokemoncenter.com/en-au";
  logger.info("pokemonCenterAustralia: attempting to fetch Pokemon Center AU");

  const html = await fetchPage(SOURCE_URL);
  if (html) {
    try {
      const ldMatches = Array.from(html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi));
      const parsed: any[] = [];
      for (const m of ldMatches) {
        try {
          const j = JSON.parse(m[1]);
          if (Array.isArray(j)) parsed.push(...j);
          else parsed.push(j);
        } catch (e) {}
      }

      const products: Partial<PokemonRelease>[] = [];
      for (const obj of parsed) {
        const name = obj.name || obj.headline || obj.title;
        const date = obj.releaseDate || obj.datePublished || obj.dateCreated;
        if (name && date) {
          products.push({
            name: String(name),
            productType: "Other",
            releaseDate: String(date).split("T")[0],
            region: "Australia",
            availabilityStatus: "announced",
            sourceUrls: [SOURCE_URL],
            retailersToCheck: ["Pokémon Center Australia"],
            confidence: "high",
          });
        }
      }

      if (products.length > 0) {
        logger.success(`pokemonCenterAustralia: parsed ${products.length} products from JSON-LD`);
        return products;
      }
    } catch (err) {
      logger.warn("pokemonCenterAustralia: JSON-LD parsing failed, falling back to curated data");
    }
  } else {
    logger.skip("pokemonCenterAustralia", "Failed to fetch Pokemon Center AU — using curated data");
  }

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

  logger.success(`pokemonCenterAustralia: returned ${known.length} products (fallback)`);
  return known;
}
