export type Occasion =
  | "date"
  | "work"
  | "party"
  | "gym"
  | "casual"
  | "formal";

export type Weather = "hot" | "cold" | "humid" | "rainy" | "cool" | "mild";

export type Mood =
  | "confident"
  | "romantic"
  | "fresh"
  | "bold"
  | "relaxed";

export type Intensity = "light" | "moderate" | "strong";

export type Gender = "masculine" | "feminine" | "unisex" | "any";

export interface RecommendationInput {
  occasion: Occasion;
  weather: Weather;
  mood: Mood;
  intensity: Intensity;
  gender: Gender;
}

export interface Fragrance {
  id: string;
  name: string;
  brand: string;
  category: string;
  family: string[];
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  intensity: Intensity;
  gender: "masculine" | "feminine" | "unisex";
  seasons: string[];
  occasions: Occasion[];
  moods: Mood[];
  weather: Weather[];
  longevity: string;
  sillage: string;
  price_tier: string;
  affiliate_slug: string;
  concierge_note?: string;
  concierge_by?: string;
}

export type Retailer = "amazon" | "sephora" | "decant" | "fragrancenet";

export interface BuyLink {
  retailer: Retailer;
  label: string;
  url: string;
  note?: string;
}

export interface Recommendation {
  id: string;
  name: string;
  brand: string;
  fragranceType: string;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  whyItWorks: string;
  whenToWearIt: string;
  intensity: Intensity;
  /** @deprecated kept for backwards-compat; prefer `buyLinks[0]` */
  buyLink: string;
  buyLinks: BuyLink[];
  conciergeNote?: string;
  conciergeBy?: string;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  headline: string;
  meta: {
    provider: "openai" | "anthropic" | "mock" | "fallback";
    usedFallback: boolean;
  };
}
