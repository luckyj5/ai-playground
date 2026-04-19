"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

type Status = "idle" | "loading" | "success" | "error";

export default function EmailCapture({
  compact = false,
  source = "landing_waitlist",
}: {
  compact?: boolean;
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
        return;
      }
      setStatus("success");
      setMessage("You're on the list. Check your inbox for the next drop.");
      track("email_submit", { source });
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again in a moment.");
    }
  }

  const wrapperClass = compact
    ? "flex flex-col gap-3 sm:flex-row"
    : "flex flex-col gap-3 sm:flex-row sm:items-center";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className={wrapperClass}>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@yourscent.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary whitespace-nowrap"
        >
          {status === "loading" ? "Adding..." : "Join the waitlist"}
        </button>
      </div>
      {message && (
        <p
          className={`mt-3 text-sm ${
            status === "success"
              ? "text-accent-deep dark:text-accent"
              : "text-red-600 dark:text-red-400"
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </form>
  );
}
