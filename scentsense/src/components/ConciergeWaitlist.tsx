"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Phase-2 tile on the results page that captures interest for 1:1 human
 * fragrance consultation. We don't build booking yet — we just capture emails
 * tagged `concierge-waitlist` so we can measure demand before investing in
 * Calendly / scheduling infrastructure.
 */
export default function ConciergeWaitlist() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [msg, setMsg] = useState<string>("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    track("concierge_waitlist_submit");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "concierge-waitlist" }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        alreadyExisted?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setState("done");
      setMsg(
        data.alreadyExisted
          ? "You're already on the list — we'll be in touch."
          : "You're in. We'll email when concierge slots open.",
      );
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-3xl">
      <div className="card-muted relative overflow-hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <span className="eyebrow">Coming soon</span>
            <h3 className="mt-1 font-display text-2xl text-ink-900 dark:text-ink-50">
              Want a human take?
            </h3>
            <p className="mt-2 text-sm text-ink-600 dark:text-ink-200">
              Our fragrance concierge owns 300+ bottles and has built signature
              wardrobes for founders, actors, and dating-app converts. Book a
              30-min call once slots open.
            </p>
          </div>
          {state === "done" ? (
            <p className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-deep dark:border-accent/40 dark:bg-accent/20 dark:text-accent">
              {msg}
            </p>
          ) : (
            <form
              onSubmit={submit}
              className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"
            >
              <label htmlFor="concierge-email" className="sr-only">
                Email
              </label>
              <input
                id="concierge-email"
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full sm:w-64"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="btn-primary whitespace-nowrap"
              >
                {state === "loading" ? "Adding..." : "Join waitlist"}
              </button>
            </form>
          )}
        </div>
        {state === "error" && (
          <p className="mt-3 text-xs text-red-600 dark:text-red-400">{msg}</p>
        )}
      </div>
    </div>
  );
}
