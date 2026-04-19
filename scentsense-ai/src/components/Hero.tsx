"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="eyebrow">Your signature, picked by AI</span>
          <h1 className="display mt-5 text-5xl text-ink-900 dark:text-ink-50 sm:text-6xl lg:text-7xl">
            Never smell
            <br />
            <span className="italic text-accent-deep dark:text-accent">
              wrong
            </span>{" "}
            again.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-600 dark:text-ink-200">
            AI-powered fragrance recommendations for every moment — your
            occasion, the weather, your mood. We pick the scent that walks in
            the room before you do.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/recommend"
              onClick={() => track("cta_click", { location: "hero_primary" })}
              className="btn-primary"
            >
              Get your recommendation →
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => track("cta_click", { location: "hero_secondary" })}
              className="btn-secondary"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-6 text-xs text-ink-500 dark:text-ink-300">
            No sign up. 60 seconds. Picks from 100+ houses including Dior,
            Chanel, Creed, Tom Ford.
          </p>
        </div>

        <div className="relative">
          <div className="card relative overflow-hidden">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/25 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-ink-900/10 blur-3xl dark:bg-accent/20" />
            <span className="eyebrow">Live preview</span>
            <p className="mt-3 font-display text-2xl text-ink-900 dark:text-ink-50">
              &ldquo;Rainy November date, confident vibe, strong
              intensity.&rdquo;
            </p>
            <div className="mt-6 space-y-4">
              <PreviewRec
                name="Tom Ford Tobacco Vanille"
                type="Oriental Gourmand"
                reason="Warm, smoky, close-range. Built for candlelight and a pulled-in collar."
              />
              <PreviewRec
                name="YSL La Nuit de L'Homme"
                type="Spicy Oriental"
                reason="Cardamom to pepper to skin — the quiet version of 'look at me.'"
              />
              <PreviewRec
                name="Maison Margiela By the Fireplace"
                type="Woody Smoky"
                reason="Wet wool and firewood. Made for cold rain and slow conversation."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewRec({
  name,
  type,
  reason,
}: {
  name: string;
  type: string;
  reason: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-4 dark:border-ink-700 dark:bg-ink-900/50">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-medium text-ink-900 dark:text-ink-50">{name}</p>
        <span className="text-xs uppercase tracking-wider text-accent-deep dark:text-accent">
          {type}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">{reason}</p>
    </div>
  );
}
