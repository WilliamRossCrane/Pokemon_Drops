import type { PokemonRelease } from "../../src/types/release.js";
import { logger } from "../utils/logger.js";

export async function target(): Promise<Partial<PokemonRelease>[]> {
  logger.skip("target", "Site uses bot protection — using curated data only");
  return [];
}
