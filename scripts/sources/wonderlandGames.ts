import type { PokemonRelease } from "../../src/types/release.js";
import { logger } from "../utils/logger.js";

export async function wonderlandGames(): Promise<Partial<PokemonRelease>[]> {
  logger.info("wonderlandGames: using curated data (Phase 1)");
  // No confirmed product listings available at time of writing.
  // Phase 4: Check their website for a public product/preorder page.
  return [];
}
