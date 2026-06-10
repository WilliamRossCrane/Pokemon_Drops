export type StoreType =
  | "local_game_store"
  | "major_retailer"
  | "online_retailer";

export type StoreRegion =
  | "Gold Coast"
  | "Brisbane"
  | "Australia Online"
  | "Other";

export interface Store {
  id: string;
  name: string;
  suburb?: string;
  region: StoreRegion;
  type: StoreType;
  websiteUrl: string;
  stocksPokemonTcg: boolean;
  hasOnlinePreorders?: boolean;
  notes?: string;
}

export const STORE_TYPE_LABELS: Record<StoreType, string> = {
  local_game_store: "Local Game Store",
  major_retailer: "Major Retailer",
  online_retailer: "Online Retailer",
};

export const REGION_ORDER: StoreRegion[] = [
  "Gold Coast",
  "Brisbane",
  "Australia Online",
  "Other",
];
