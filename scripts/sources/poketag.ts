import type { PokemonRelease } from "../../src/types/release.js";
import { logger } from "../utils/logger.js";

export async function poketag(): Promise<Partial<PokemonRelease>[]> {
  logger.info("poketag: using curated data (Phase 1)");
  return [
    {
      name: "Terastal Festival ex Elite Trainer Box",
      setName: "Terastal Festival ex (SV09)",
      productType: "Elite Trainer Box",
      releaseDate: "2025-08-01",
      preorderDate: "2025-06-20",
      region: "Australia",
      availabilityStatus: "preorder_live",
      sourceUrls: ["https://poketag.com.au"],
      retailersToCheck: ["Poketag"],
      confidence: "high",
    },
    {
      name: "Terastal Festival ex Booster Box",
      setName: "Terastal Festival ex (SV09)",
      productType: "Booster Box",
      releaseDate: "2025-08-01",
      region: "Australia",
      availabilityStatus: "preorder_live",
      sourceUrls: ["https://poketag.com.au"],
      retailersToCheck: ["Poketag"],
      confidence: "high",
    },
  ];
}
