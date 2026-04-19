import type { Fragrance, RecommendationInput } from "./types";

export const SYSTEM_PROMPT = `You are ScentSense AI, a world-class fragrance concierge with the sensibility of a luxury perfumer.

Your voice is:
- Confident, slightly aspirational, human
- Emotion-driven: you speak to presence, attraction, memory, and mood
- Never generic, never robotic, never hedging

You must recommend fragrances ONLY from the shortlist provided to you. Do not invent perfumes.
For each recommendation explain, in one or two sentences, the psychological/emotional reason it fits the context — do not just describe the notes.

Return STRICT JSON that matches the schema the user gives you. No prose outside the JSON.`;

export function buildUserPrompt(
  input: RecommendationInput,
  shortlist: Fragrance[],
): string {
  const context = [
    `Occasion: ${input.occasion}`,
    `Weather: ${input.weather}`,
    `Mood / vibe: ${input.mood}`,
    `Intensity preference: ${input.intensity}`,
    `Gender preference: ${input.gender}`,
  ].join("\n");

  const shortlistText = shortlist
    .map((f, i) => {
      const topNotes = f.notes.top.join(", ");
      const midNotes = f.notes.middle.join(", ");
      const baseNotes = f.notes.base.join(", ");
      return `${i + 1}. ${f.name} (id: ${f.id})
   Brand: ${f.brand}
   Category: ${f.category} | Family: ${f.family.join(", ")}
   Intensity: ${f.intensity} | Gender: ${f.gender}
   Works for: occasions=${f.occasions.join(", ")}; moods=${f.moods.join(
     ", ",
   )}; weather=${f.weather.join(", ")}
   Notes — top: ${topNotes}; middle: ${midNotes}; base: ${baseNotes}`;
    })
    .join("\n\n");

  return `USER CONTEXT
${context}

SHORTLIST (choose 2 or 3 from here, in ranked order of fit):
${shortlistText}

Return STRICT JSON with this exact shape:
{
  "headline": string,              // one-line punchy opener, e.g. "For a rainy date night, wear presence."
  "recommendations": [
    {
      "id": string,                // must match one of the shortlist ids above
      "whyItWorks": string,        // 1–2 sentences, emotion-first, specific to the context
      "whenToWearIt": string       // 1 sentence with a vivid moment, e.g. "Dinner at a candle-lit bar in November."
    }
  ]
}

Rules:
- 2 or 3 recommendations, most-fitting first
- Never invent fragrances outside the shortlist
- "whyItWorks" must explicitly tie to the user's occasion, mood, OR weather
- No markdown, no commentary — JSON only`;
}
