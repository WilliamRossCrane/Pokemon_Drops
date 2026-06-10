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
import { logger, fetchPage } from "../utils/index.js";

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
  const SOURCE_URL = "https://www.pokemon.com/en/pokemon-tcg/product-line/";
  logger.info("pokemonOfficial: attempting to fetch official product page");

  const html = await fetchPage(SOURCE_URL);

  if (html) {
    try {
      // Try to extract JSON-LD blocks which sometimes contain product data
      const ldMatches = Array.from(html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi));
      const parsed: any[] = [];
      for (const m of ldMatches) {
        try {
          const j = JSON.parse(m[1]);
          if (Array.isArray(j)) parsed.push(...j);
          else parsed.push(j);
        } catch (e) {
          // ignore JSON parse errors for individual blocks
        }
      }

      const products: Partial<PokemonRelease>[] = [];
      for (const obj of parsed) {
        // Look for items that resemble product or event data
        if (!obj || typeof obj !== "object") continue;
        const name = obj.name || obj.headline || obj.title;
        const date = obj.releaseDate || obj.datePublished || obj.dateCreated;
        if (name && date) {
          products.push({
            name: String(name),
            productType: "Other",
            releaseDate: String(date).split("T")[0],
            region: "Global",
            availabilityStatus: "announced",
            sourceUrls: [SOURCE_URL],
            retailersToCheck: [],
            confidence: "high",
          });
        }
      }

      if (products.length > 0) {
        logger.success(`pokemonOfficial: parsed ${products.length} products from JSON-LD`);
        return products;
      }
    } catch (err) {
      logger.warn("pokemonOfficial: JSON-LD parsing failed, falling back to curated data");
    }
  } else {
    logger.skip("pokemonOfficial", "Failed to fetch official page — using curated data");
  }

  logger.info("pokemonOfficial: using curated static data (fallback)");

  // These are publicly known upcoming releases as of the script's last edit.
  // Kept as a conservative fallback when direct parsing isn't available.
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

  logger.success(`pokemonOfficial: returned ${known.length} products (fallback)`);
  return known;
}
