"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  Gender,
  Intensity,
  Mood,
  Occasion,
  RecommendationInput,
  RecommendationResponse,
  Weather,
} from "@/lib/types";
import { track } from "@/lib/analytics";
import ResultsCard from "./ResultsCard";
import ConciergeWaitlist from "./ConciergeWaitlist";

const STORAGE_KEY = "scentsense-prefs";

const OCCASIONS: { value: Occasion; label: string; hint: string }[] = [
  { value: "date", label: "Date night", hint: "Close range, magnetic" },
  { value: "work", label: "Work", hint: "Professional, room-owning" },
  { value: "party", label: "Party", hint: "Loud, confident, memorable" },
  { value: "gym", label: "Gym", hint: "Clean, athletic, light" },
  { value: "casual", label: "Casual", hint: "Everyday, effortless" },
  { value: "formal", label: "Formal", hint: "Black tie, refined" },
];

const WEATHERS: { value: Weather; label: string; hint: string }[] = [
  { value: "hot", label: "Hot", hint: "80°F+, bright sun" },
  { value: "humid", label: "Humid", hint: "Sticky, tropical" },
  { value: "mild", label: "Mild", hint: "Perfect shoulder-season" },
  { value: "rainy", label: "Rainy", hint: "Wet, moody" },
  { value: "cool", label: "Cool", hint: "Crisp, jacket weather" },
  { value: "cold", label: "Cold", hint: "Below freezing" },
];

const MOODS: { value: Mood; label: string; hint: string }[] = [
  { value: "confident", label: "Confident", hint: "Walk in slow" },
  { value: "romantic", label: "Romantic", hint: "Whispered intent" },
  { value: "fresh", label: "Fresh", hint: "Post-shower clean" },
  { value: "bold", label: "Bold", hint: "Turn-your-head" },
  { value: "relaxed", label: "Relaxed", hint: "Off-duty cool" },
];

const INTENSITIES: { value: Intensity; label: string; hint: string }[] = [
  { value: "light", label: "Light", hint: "Stay close to skin" },
  { value: "moderate", label: "Moderate", hint: "Arm's length" },
  { value: "strong", label: "Strong", hint: "Own the room" },
];

const GENDERS: { value: Gender; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "masculine", label: "Masculine" },
  { value: "feminine", label: "Feminine" },
  { value: "unisex", label: "Unisex" },
];

type Step = 0 | 1 | 2 | 3 | 4;

const DEFAULT_INPUT: RecommendationInput = {
  occasion: "date",
  weather: "cool",
  mood: "confident",
  intensity: "moderate",
  gender: "any",
};

export default function RecommendationFlow() {
  const [step, setStep] = useState<Step>(0);
  const [input, setInput] = useState<RecommendationInput>(DEFAULT_INPUT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  // Restore prefs from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<RecommendationInput>;
        setInput((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore
    }
    track("flow_start");
  }, []);

  // Persist prefs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
    } catch {
      // ignore
    }
  }, [input]);

  const totalSteps = 5;
  const progress = useMemo(() => {
    if (result) return 100;
    return Math.min(100, Math.round((step / totalSteps) * 100));
  }, [step, result]);

  async function submit(finalInput: RecommendationInput) {
    setLoading(true);
    setError(null);
    setResult(null);
    track("flow_submit", { ...finalInput });
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalInput),
      });
      const data = (await res.json()) as
        | RecommendationResponse
        | { error: string };
      if (!res.ok || "error" in data) {
        setError(
          "error" in data
            ? data.error
            : "Something went wrong generating your recommendations.",
        );
        return;
      }
      setResult(data);
      track("recommendation_view", {
        count: data.recommendations.length,
        provider: data.meta.provider,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function advance() {
    track("flow_step", { step });
    if (step === 4) {
      submit(input);
      return;
    }
    setStep((s) => ((s + 1) as Step));
  }

  function back() {
    if (step === 0) return;
    setStep((s) => ((s - 1) as Step));
  }

  function tryAnotherVibe() {
    track("try_another_vibe");
    setResult(null);
    setStep(2);
  }

  if (result) {
    return (
      <>
        <ResultsCard
          input={input}
          response={result}
          onTryAnother={tryAnotherVibe}
          onStartOver={() => {
            setResult(null);
            setStep(0);
          }}
        />
        <ConciergeWaitlist />
      </>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ProgressBar value={progress} />
      <div className="card mt-6">
        {step === 0 && (
          <StepGrid
            eyebrow="Step 1 of 5"
            title="Where are you going?"
            subtitle="The moment sets the scent."
            options={OCCASIONS}
            value={input.occasion}
            onSelect={(v) => setInput({ ...input, occasion: v })}
          />
        )}
        {step === 1 && (
          <StepGrid
            eyebrow="Step 2 of 5"
            title="What's the weather doing?"
            subtitle="Heat diffuses, cold holds. It matters."
            options={WEATHERS}
            value={input.weather}
            onSelect={(v) => setInput({ ...input, weather: v })}
          />
        )}
        {step === 2 && (
          <StepGrid
            eyebrow="Step 3 of 5"
            title="What's the vibe?"
            subtitle="How do you want to feel when you walk in?"
            options={MOODS}
            value={input.mood}
            onSelect={(v) => setInput({ ...input, mood: v })}
          />
        )}
        {step === 3 && (
          <StepGrid
            eyebrow="Step 4 of 5"
            title="How loud should it be?"
            subtitle="Presence dial — up to you."
            options={INTENSITIES}
            value={input.intensity}
            onSelect={(v) => setInput({ ...input, intensity: v })}
          />
        )}
        {step === 4 && (
          <StepGrid
            eyebrow="Step 5 of 5"
            title="Any gender lean?"
            subtitle="Optional. We skew unisex when you pick 'any'."
            options={GENDERS.map((g) => ({
              value: g.value,
              label: g.label,
              hint: "",
            }))}
            value={input.gender}
            onSelect={(v) => setInput({ ...input, gender: v })}
          />
        )}

        {error && (
          <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            className="btn-ghost"
            disabled={step === 0 || loading}
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={advance}
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "Composing..."
              : step === 4
                ? "Get my recommendations"
                : "Continue →"}
          </button>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-ink-500 dark:text-ink-300">
        We save your last preferences on this device so you can try again fast.
      </p>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
      <div
        className="h-full bg-accent-deep transition-all dark:bg-accent"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

interface StepGridProps<T extends string> {
  eyebrow: string;
  title: string;
  subtitle: string;
  options: { value: T; label: string; hint: string }[];
  value: T;
  onSelect: (v: T) => void;
}

function StepGrid<T extends string>({
  eyebrow,
  title,
  subtitle,
  options,
  value,
  onSelect,
}: StepGridProps<T>) {
  return (
    <div>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="display mt-2 text-3xl text-ink-900 dark:text-ink-50 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-2 text-ink-600 dark:text-ink-200">{subtitle}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-ink-900 bg-ink-900 text-ink-50 shadow-soft dark:border-accent dark:bg-accent dark:text-ink-900"
                  : "border-ink-200 bg-white hover:border-ink-400 dark:border-ink-700 dark:bg-ink-900/50 dark:hover:border-accent"
              }`}
            >
              <p className="font-medium">{opt.label}</p>
              {opt.hint && (
                <p
                  className={`mt-1 text-sm ${
                    selected
                      ? "text-ink-50/80 dark:text-ink-900/70"
                      : "text-ink-500 dark:text-ink-300"
                  }`}
                >
                  {opt.hint}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
