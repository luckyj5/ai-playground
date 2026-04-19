import type {
  Fragrance,
  Recommendation,
  RecommendationInput,
  RecommendationResponse,
} from "./types";
import { buildUserPrompt, SYSTEM_PROMPT } from "./prompt";
import { rankFragrances } from "./rules";
import { buyLinksFor, primaryBuyLinkFor } from "./buyLinks";

type Provider = "openai" | "anthropic" | "mock";

interface ModelJson {
  headline: string;
  recommendations: Array<{
    id: string;
    whyItWorks: string;
    whenToWearIt: string;
  }>;
}

function getProvider(): Provider {
  const raw = (process.env.LLM_PROVIDER || "mock").toLowerCase();
  if (raw === "openai" || raw === "anthropic" || raw === "mock") return raw;
  return "mock";
}

function recordFor(f: Fragrance): Pick<
  Recommendation,
  "buyLink" | "buyLinks" | "conciergeNote" | "conciergeBy"
> {
  return {
    buyLink: primaryBuyLinkFor(f),
    buyLinks: buyLinksFor(f),
    conciergeNote: f.concierge_note,
    conciergeBy: f.concierge_by,
  };
}

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
  }
  return trimmed;
}

function parseModelJson(text: string): ModelJson {
  const cleaned = stripCodeFences(text);
  // Attempt to find the first JSON object if the model added stray prose
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  const candidate =
    firstBrace >= 0 && lastBrace > firstBrace
      ? cleaned.slice(firstBrace, lastBrace + 1)
      : cleaned;
  const parsed = JSON.parse(candidate) as ModelJson;
  if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
    throw new Error("Model JSON missing recommendations[]");
  }
  return parsed;
}

async function callOpenAI(userPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI ${res.status}: ${body.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned empty content");
  return content;
}

async function callAnthropic(userPrompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  const model = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 800,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic ${res.status}: ${body.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    content: Array<{ type: string; text?: string }>;
  };
  const text = data.content?.find((c) => c.type === "text")?.text;
  if (!text) throw new Error("Anthropic returned empty content");
  return text;
}

function assembleRecommendations(
  shortlist: Fragrance[],
  modelJson: ModelJson,
): Recommendation[] {
  const byId = new Map(shortlist.map((f) => [f.id, f]));
  const recs: Recommendation[] = [];
  for (const r of modelJson.recommendations.slice(0, 3)) {
    const f = byId.get(r.id);
    if (!f) continue;
    recs.push({
      id: f.id,
      name: f.name,
      brand: f.brand,
      fragranceType: f.category,
      notes: f.notes,
      whyItWorks: r.whyItWorks,
      whenToWearIt: r.whenToWearIt,
      intensity: f.intensity,
      ...recordFor(f),
    });
  }
  return recs;
}

function deterministicFallback(
  input: RecommendationInput,
  shortlist: Fragrance[],
): Recommendation[] {
  const picks = shortlist.slice(0, 3);
  return picks.map((f) => ({
    id: f.id,
    name: f.name,
    brand: f.brand,
    fragranceType: f.category,
    notes: f.notes,
    whyItWorks: `A ${f.intensity} ${f.family[0]} composition that matches a ${input.mood} ${input.occasion} in ${input.weather} weather — it sits exactly where your context lives.`,
    whenToWearIt: `Wear it for your ${input.occasion} when the air is ${input.weather} and you want to feel ${input.mood}.`,
    intensity: f.intensity,
    ...recordFor(f),
  }));
}

function fallbackHeadline(input: RecommendationInput): string {
  const map: Record<string, string> = {
    date: "For tonight, wear presence.",
    work: "Your room-owning signature, refined for the day.",
    party: "Walk in smelling unforgettable.",
    gym: "Fresh, effortless, clean — not a cologne cloud.",
    casual: "Low effort. High impression.",
    formal: "Understated authority, bottled.",
  };
  return map[input.occasion] || "Your next signature, picked for this moment.";
}

export async function getRecommendations(
  input: RecommendationInput,
): Promise<RecommendationResponse> {
  const shortlist = rankFragrances(input, 8);
  const provider = getProvider();

  if (provider === "mock" || shortlist.length === 0) {
    return {
      recommendations: deterministicFallback(input, shortlist),
      headline: fallbackHeadline(input),
      meta: { provider: "mock", usedFallback: false },
    };
  }

  const userPrompt = buildUserPrompt(input, shortlist);
  try {
    const raw =
      provider === "openai"
        ? await callOpenAI(userPrompt)
        : await callAnthropic(userPrompt);
    const parsed = parseModelJson(raw);
    const recs = assembleRecommendations(shortlist, parsed);
    if (recs.length === 0) throw new Error("No valid ids in model response");
    return {
      recommendations: recs,
      headline: parsed.headline || fallbackHeadline(input),
      meta: { provider, usedFallback: false },
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[scentsense] LLM call failed, using fallback:", err);
    return {
      recommendations: deterministicFallback(input, shortlist),
      headline: fallbackHeadline(input),
      meta: { provider: "fallback", usedFallback: true },
    };
  }
}
