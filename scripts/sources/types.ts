import type { PokemonRelease } from "../../src/types/release.js";

export type SourceAdapter = () => Promise<Partial<PokemonRelease>[]>;

export interface SourceAdapterItem {
  name: string;
  fn: SourceAdapter;
}
