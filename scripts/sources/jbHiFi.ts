import type { PokemonRelease } from "../../src/types/release.js";
import { logger } from "../utils/logger.js";

export async function jbHiFi(): Promise<Partial<PokemonRelease>[]> {
  logger.skip("jbHiFi", "Site uses bot protection — using curated data only");
  return [];
}
