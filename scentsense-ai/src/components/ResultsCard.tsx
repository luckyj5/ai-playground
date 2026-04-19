"use client";

import { useMemo } from "react";
import { track } from "@/lib/analytics";
import type {
  RecommendationInput,
  RecommendationResponse,
} from "@/lib/types";

export default function ResultsCard({
  input,
  response,
  onTryAnother,
  onStartOver,
}: {
  input: RecommendationInput;
  response: RecommendationResponse;
  onTryAnother: () => void;
  onStartOver: () => void;
}) {
  const contextSummary = useMemo(() => {
    return `${input.mood} · ${input.occasion} · ${input.weather} · ${input.intensity}`;
  }, [input]);

  async function share() {
    track("share_click");
    const shareText = `My ScentSense AI picks for ${contextSummary}:\n\n${response.recommendations
      .map((r, i) => `${i + 1}. ${r.name} — ${r.whyItWorks}`)
      .join("\n")}\n\nTry yours at scentsense.ai`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "ScentSense AI picks",
          text: shareText,
          url: typeof window !== "undefined" ? window.location.href : "",
        });
        return;
      }
      await navigator.clipboard.writeText(shareText);
      // eslint-disable-next-line no-alert
      alert("Copied to clipboard.");
    } catch {
      // User cancelled or permission denied – ignore
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card">
        <span className="eyebrow">Your picks</span>
        <h2 className="display mt-3 text-3xl text-ink-900 dark:text-ink-50 sm:text-4xl">
          {response.headline}
        </h2>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">
          Curated for {contextSummary}
        </p>

        <ol className="mt-8 space-y-6">
          {response.recommendations.map((rec, i) => (
            <li key={rec.id} className="card-muted">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="eyebrow">
                    #{i + 1} · {rec.fragranceType}
                  </span>
                  <h3 className="mt-1 font-display text-2xl text-ink-900 dark:text-ink-50 sm:text-3xl">
                    {rec.name}
                  </h3>
                  <p className="text-sm text-ink-500 dark:text-ink-300">
                    {rec.brand} · {rec.intensity} intensity
                  </p>
                </div>
                <a
                  href={rec.buyLink}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() =>
                    track("affiliate_click", { fragrance: rec.id })
                  }
                  className="btn-secondary hidden sm:inline-flex"
                >
                  Shop →
                </a>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="eyebrow">Why it works</p>
                  <p className="mt-1 text-ink-700 dark:text-ink-100">
                    {rec.whyItWorks}
                  </p>
                </div>
                <div>
                  <p className="eyebrow">When to wear it</p>
                  <p className="mt-1 text-ink-700 dark:text-ink-100">
                    {rec.whenToWearIt}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <NoteBlock label="Top" notes={rec.notes.top} />
                <NoteBlock label="Heart" notes={rec.notes.middle} />
                <NoteBlock label="Base" notes={rec.notes.base} />
              </div>

              <a
                href={rec.buyLink}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={() =>
                  track("affiliate_click", { fragrance: rec.id })
                }
                className="btn-secondary mt-5 sm:hidden"
              >
                Shop →
              </a>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="button" onClick={onTryAnother} className="btn-primary">
            Try another vibe
          </button>
          <button type="button" onClick={share} className="btn-secondary">
            Share these picks
          </button>
          <button type="button" onClick={onStartOver} className="btn-ghost">
            Start over
          </button>
        </div>

        {response.meta.usedFallback && (
          <p className="mt-6 rounded-2xl border border-ink-100 bg-ink-50 p-3 text-xs text-ink-500 dark:border-ink-700 dark:bg-ink-900/50 dark:text-ink-300">
            Our AI concierge was briefly unavailable — these picks are from our
            rule-based fallback. Refresh to retry the model.
          </p>
        )}
      </div>
    </div>
  );
}

function NoteBlock({ label, notes }: { label: string; notes: string[] }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white/70 p-4 dark:border-ink-700 dark:bg-ink-900/40">
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-sm text-ink-700 dark:text-ink-100">
        {notes.join(", ")}
      </p>
    </div>
  );
}
