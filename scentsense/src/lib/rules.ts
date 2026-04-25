import fragrances from "@/data/fragrances.json";
import type { Fragrance, RecommendationInput } from "./types";

const DATA = fragrances as Fragrance[];

interface Scored {
  fragrance: Fragrance;
  score: number;
}

/**
 * Rule-based pre-filter that ranks fragrances against the user's context.
 * Returns a short-list that the LLM can reason over. This keeps responses
 * grounded in real products instead of hallucinated names.
 */
export function rankFragrances(
  input: RecommendationInput,
  limit = 8,
): Fragrance[] {
  const scored: Scored[] = DATA.map((f) => {
    let score = 0;

    if (f.occasions.includes(input.occasion)) score += 3;
    if (f.moods.includes(input.mood)) score += 3;
    if (f.weather.includes(input.weather)) score += 2;
    if (f.intensity === input.intensity) score += 2;
    else if (
      (input.intensity === "moderate" && f.intensity !== "light") ||
      (input.intensity === "strong" && f.intensity === "moderate") ||
      (input.intensity === "light" && f.intensity === "moderate")
    ) {
      score += 1;
    }

    if (f.gender === input.gender) score += 2;
    else if (input.gender === "any" || f.gender === "unisex") score += 1;
    else score -= 2;

    // Gentle penalty for mismatched weather extremes
    if (input.weather === "hot" && f.intensity === "strong") score -= 1;
    if (input.weather === "cold" && f.intensity === "light") score -= 1;

    return { fragrance: f, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.fragrance);
}
