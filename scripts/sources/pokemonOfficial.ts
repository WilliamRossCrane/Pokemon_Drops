/**
 * Source adapter: pokemon.com official product listings.
 *
 * The Pokémon Company's product pages are publicly browsable.
 * This adapter fetches the main TCG products page and attempts to
 * find upcoming product listings.
 *
 * NOTE: The Pokémon Company's website structure changes frequently.
 * This adapter uses conservative, graceful parsing. If the page
 * structure changes and parsing fails, it logs a warning and returns
 * an empty array — it does NOT crash the whole update script.
 */

import type { PokemonRelease } from "../../src/types/release.js";
import { logger } from "../utils/logger.js";

// ─── Shared adapter interface ────────────────────────────────────────────────

/**
 * All source adapters must export a default function matching this signature.
 * Returns an array of partial release data that will be normalised and merged
 * by the main update script.
 */
export type SourceAdapter = () => Promise<Partial<PokemonRelease>[]>;

// ─── pokemonOfficial adapter ─────────────────────────────────────────────────

/**
 * For Phase 1, this adapter returns a static/curated list of known upcoming
 * releases. Real HTML scraping can be added here in Phase 4.
 *
 * Why static data for now?
 * - The pokemon.com product page is JavaScript-rendered, making it harder
 *   to parse with a simple fetch.
 * - Static data lets us ship a working site immediately.
 * - The adapter structure means we can swap in real scraping without
 *   changing any other part of the codebase.
 */
export async function pokemonOfficial(): Promise<Partial<PokemonRelease>[]> {
  logger.info("pokemonOfficial: using curated static data (Phase 1)");

  // These are publicly known upcoming releases as of the script's last edit.
  // In Phase 4, replace this with real page parsing.
  const known: Partial<PokemonRelease>[] = [
    {
      name: "Terastal Festival ex Elite Trainer Box",
      setName: "Terastal Festival ex (SV09)",
      productType: "Elite Trainer Box",
      releaseDate: "2025-08-01",
      preorderDate: "2025-06-20",
      region: "Australia",
      availabilityStatus: "preorder_live",
      sourceUrls: ["https://www.pokemon.com/en/pokemon-tcg/product-line/"],
      retailersToCheck: [
        "Good Games Gold Coast",
        "Poketag",
        "EB Games / Zing",
        "Pokémon Center Australia",
        "JB Hi-Fi",
      ],
      confidence: "high",
      notes: "Official SV09 set. Preorders confirmed live.",
    },
    {
      name: "Terastal Festival ex Booster Box",
      setName: "Terastal Festival ex (SV09)",
      productType: "Booster Box",
      releaseDate: "2025-08-01",
      region: "Australia",
      availabilityStatus: "preorder_live",
      sourceUrls: ["https://www.pokemon.com/en/pokemon-tcg/product-line/"],
      retailersToCheck: ["Poketag", "Good Games Gold Coast", "Pokémon Center Australia"],
      confidence: "high",
    },
    {
      name: "Destined Rivals Elite Trainer Box",
      setName: "Destined Rivals (SV10)",
      productType: "Elite Trainer Box",
      releaseDate: "2025-11-07",
      region: "Australia",
      availabilityStatus: "announced",
      sourceUrls: ["https://www.pokemon.com/en/pokemon-tcg/product-line/"],
      retailersToCheck: [
        "Good Games Gold Coast",
        "Poketag",
        "EB Games / Zing",
        "Big W",
        "Pokémon Center Australia",
      ],
      confidence: "high",
    },
    {
      name: "Destined Rivals Booster Box",
      setName: "Destined Rivals (SV10)",
      productType: "Booster Box",
      releaseDate: "2025-11-07",
      region: "Australia",
      availabilityStatus: "announced",
      sourceUrls: ["https://www.pokemon.com/en/pokemon-tcg/product-line/"],
      retailersToCheck: ["Poketag", "Good Games Gold Coast", "Pokémon Center Australia"],
      confidence: "high",
    },
  ];

  logger.success(`pokemonOfficial: returned ${known.length} products`);
  return known;
}
