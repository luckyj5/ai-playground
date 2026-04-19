import { NextResponse } from "next/server";
import { getRecommendations } from "@/lib/llm";
import type {
  Gender,
  Intensity,
  Mood,
  Occasion,
  RecommendationInput,
  Weather,
} from "@/lib/types";

export const runtime = "nodejs";

const OCCASIONS: Occasion[] = [
  "date",
  "work",
  "party",
  "gym",
  "casual",
  "formal",
];
const WEATHERS: Weather[] = [
  "hot",
  "cold",
  "humid",
  "rainy",
  "cool",
  "mild",
];
const MOODS: Mood[] = ["confident", "romantic", "fresh", "bold", "relaxed"];
const INTENSITIES: Intensity[] = ["light", "moderate", "strong"];
const GENDERS: Gender[] = ["masculine", "feminine", "unisex", "any"];

function isOneOf<T extends string>(allowed: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

function parseInput(body: unknown): RecommendationInput | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (
    isOneOf(OCCASIONS, b.occasion) &&
    isOneOf(WEATHERS, b.weather) &&
    isOneOf(MOODS, b.mood) &&
    isOneOf(INTENSITIES, b.intensity) &&
    isOneOf(GENDERS, b.gender)
  ) {
    return {
      occasion: b.occasion,
      weather: b.weather,
      mood: b.mood,
      intensity: b.intensity,
      gender: b.gender,
    };
  }
  return null;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }
  const input = parseInput(body);
  if (!input) {
    return NextResponse.json(
      { error: "Missing or invalid fields." },
      { status: 400 },
    );
  }

  try {
    const result = await getRecommendations(input);
    return NextResponse.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[scentsense] recommend route failed", err);
    return NextResponse.json(
      { error: "Recommendation service failed. Please try again." },
      { status: 500 },
    );
  }
}
