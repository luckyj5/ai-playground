"use client";

import { useMemo } from "react";
import { track } from "@/lib/analytics";
import type {
  BuyLink,
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
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="eyebrow">
                      #{i + 1} · {rec.fragranceType}
                    </span>
                    {rec.conciergeNote && (
                      <span className="inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-accent-deep dark:bg-accent/20 dark:text-accent">
                        Concierge pick
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 font-display text-2xl text-ink-900 dark:text-ink-50 sm:text-3xl">
                    {rec.name}
                  </h3>
                  <p className="text-sm text-ink-500 dark:text-ink-300">
                    {rec.brand} · {rec.intensity} intensity
                  </p>

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

                  {rec.conciergeNote && (
                    <blockquote className="mt-5 border-l-2 border-accent/50 pl-4 text-sm italic text-ink-600 dark:text-ink-200">
                      &ldquo;{rec.conciergeNote}&rdquo;
                      {rec.conciergeBy && (
                        <footer className="mt-1 text-xs not-italic text-ink-500 dark:text-ink-300">
                          — {rec.conciergeBy}, fragrance concierge
                        </footer>
                      )}
                    </blockquote>
                  )}

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <NoteBlock label="Top" notes={rec.notes.top} />
                    <NoteBlock label="Heart" notes={rec.notes.middle} />
                    <NoteBlock label="Base" notes={rec.notes.base} />
                  </div>
                </div>

                <BuyPanel
                  fragranceId={rec.id}
                  fragranceName={rec.name}
                  links={rec.buyLinks}
                />
              </div>
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

function BuyPanel({
  fragranceId,
  fragranceName,
  links,
}: {
  fragranceId: string;
  fragranceName: string;
  links: BuyLink[];
}) {
  if (!links || links.length === 0) return null;
  const [primary, ...rest] = links;
  return (
    <aside
      aria-label={`Where to buy ${fragranceName}`}
      className="shrink-0 rounded-2xl border border-ink-100 bg-white/80 p-4 dark:border-ink-700 dark:bg-ink-900/50 lg:w-64"
    >
      <p className="eyebrow">Where to buy</p>
      <a
        href={primary.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() =>
          track("affiliate_click", {
            fragrance: fragranceId,
            retailer: primary.retailer,
            position: "primary",
          })
        }
        className="btn-primary mt-3 w-full justify-center"
      >
        {primary.label} →
      </a>
      {primary.note && (
        <p className="mt-1 text-[11px] text-ink-500 dark:text-ink-400">
          {primary.note}
        </p>
      )}
      {rest.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm">
          {rest.map((link) => (
            <li key={link.retailer}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={() =>
                  track("affiliate_click", {
                    fragrance: fragranceId,
                    retailer: link.retailer,
                    position: "secondary",
                  })
                }
                className="group flex items-center justify-between rounded-lg px-2 py-1 text-ink-600 hover:bg-ink-50 hover:text-ink-900 dark:text-ink-200 dark:hover:bg-ink-800 dark:hover:text-ink-50"
              >
                <span className="truncate">{link.label}</span>
                <span className="ml-2 text-xs text-ink-400 opacity-0 transition group-hover:opacity-100 dark:text-ink-400">
                  open →
                </span>
              </a>
              {link.note && (
                <p className="mx-2 mt-0.5 text-[11px] text-ink-400 dark:text-ink-500">
                  {link.note}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[10px] text-ink-400 dark:text-ink-500">
        Affiliate links — we may earn a small commission.
      </p>
    </aside>
  );
}

function NoteBlock({ label, notes }: { label: string; notes: string[] }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white/60 p-3 dark:border-ink-700 dark:bg-ink-900/40">
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-sm text-ink-700 dark:text-ink-100">
        {notes.join(", ")}
      </p>
    </div>
  );
}
