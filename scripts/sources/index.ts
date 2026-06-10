import { pokemonOfficial } from "./pokemonOfficial.js";
import { pokemonCenterAustralia } from "./pokemonCenterAustralia.js";
import { ebGames } from "./ebGames.js";
import { bigW } from "./bigW.js";
import { kmart } from "./kmart.js";
import { target } from "./target.js";
import { jbHiFi } from "./jbHiFi.js";
import { goodGames } from "./goodGames.js";
import { poketag } from "./poketag.js";
import { wonderlandGames } from "./wonderlandGames.js";
import type { SourceAdapterItem } from "./types.js";

export const SOURCE_ADAPTERS: SourceAdapterItem[] = [
  { name: "pokemonOfficial", fn: pokemonOfficial },
  { name: "pokemonCenterAustralia", fn: pokemonCenterAustralia },
  { name: "ebGames", fn: ebGames },
  { name: "bigW", fn: bigW },
  { name: "kmart", fn: kmart },
  { name: "target", fn: target },
  { name: "jbHiFi", fn: jbHiFi },
  { name: "goodGames", fn: goodGames },
  { name: "poketag", fn: poketag },
  { name: "wonderlandGames", fn: wonderlandGames },
];
