export type ProductType =
  | "Elite Trainer Box"
  | "Booster Box"
  | "Booster Bundle"
  | "Collection Box"
  | "Premium Collection"
  | "Tin"
  | "Deck"
  | "Accessory"
  | "Other";

export type AvailabilityStatus =
  | "announced"
  | "preorder_expected"
  | "preorder_live"
  | "released"
  | "restock_possible"
  | "sold_out"
  | "unknown";

export type Confidence = "high" | "medium" | "low";

export interface PokemonRelease {
  id: string;
  name: string;
  setName?: string;
  productType: ProductType;
  releaseDate?: string;         // ISO date string: "2025-08-01"
  preorderDate?: string;        // ISO date string
  region: "Australia" | "Global" | "Unknown";
  availabilityStatus: AvailabilityStatus;
  imageUrl?: string;
  sourceUrls: string[];
  retailersToCheck: string[];
  confidence: Confidence;
  notes?: string;
  lastChecked: string;          // ISO datetime string
}

// Convenience helpers used by components
export const PRODUCT_TYPES: ProductType[] = [
  "Elite Trainer Box",
  "Booster Box",
  "Booster Bundle",
  "Collection Box",
  "Premium Collection",
  "Tin",
  "Deck",
  "Accessory",
  "Other",
];

export const STATUS_LABELS: Record<AvailabilityStatus, string> = {
  announced: "Announced",
  preorder_expected: "Preorder Expected",
  preorder_live: "Preorder Live",
  released: "Released",
  restock_possible: "Restock Possible",
  sold_out: "Sold Out",
  unknown: "Unknown",
};

export const STATUS_COLORS: Record<AvailabilityStatus, string> = {
  announced: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  preorder_expected: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  preorder_live: "bg-pokeyellow-400/20 text-yellow-300 border-yellow-500/30",
  released: "bg-green-500/20 text-green-300 border-green-500/30",
  restock_possible: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  sold_out: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  unknown: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export const CONFIDENCE_COLORS: Record<Confidence, string> = {
  high: "bg-green-500/20 text-green-300 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  low: "bg-red-500/20 text-red-300 border-red-500/30",
};
