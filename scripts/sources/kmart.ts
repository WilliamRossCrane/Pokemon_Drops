import type { PokemonRelease } from "../../src/types/release.js";
import { logger } from "../utils/logger.js";

export async function kmart(): Promise<Partial<PokemonRelease>[]> {
  logger.skip("kmart", "Site uses bot protection — using curated data only");
  return [
    {
      name: "Scarlet & Violet 151 ETB — Possible Restock",
      setName: "Scarlet & Violet 151",
      productType: "Elite Trainer Box",
      region: "Australia",
      availabilityStatus: "restock_possible",
      sourceUrls: ["https://www.kmart.com.au"],
      retailersToCheck: ["Kmart"],
      confidence: "low",
      notes: "Kmart periodically restocks popular sets. Check in-store.",
    },
  ];
}
