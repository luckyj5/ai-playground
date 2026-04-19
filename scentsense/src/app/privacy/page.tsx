import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How ScentSense AI collects, uses, and protects your data.",
};

const LAST_UPDATED = "Pilot launch";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <span className="eyebrow">Privacy</span>
        <h1 className="display mt-3 text-4xl text-ink-900 dark:text-ink-50 sm:text-5xl">
          Privacy policy
        </h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">
          Last updated: {LAST_UPDATED}
        </p>

        <section className="mt-8 space-y-6 text-ink-700 dark:text-ink-100">
          <p>
            ScentSense AI (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a fragrance
            recommendation tool currently in invite-only pilot. This page
            describes what we collect and why. It is intentionally short —
            replace it with a full policy before a public launch.
          </p>

          <h2 className="mt-8 font-display text-2xl text-ink-900 dark:text-ink-50">
            What we collect
          </h2>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Your recommendation context</strong> (occasion, weather,
              mood, intensity, gender preference). This is processed to generate
              recommendations and is not linked to your identity unless you also
              submit your email.
            </li>
            <li>
              <strong>Your email</strong>, only if you submit it to the waitlist
              or the concierge-waitlist form. We store email + source + timestamp.
            </li>
            <li>
              <strong>Anonymous analytics events</strong> (page views, flow
              steps, affiliate clicks) — no personal data attached.
            </li>
          </ul>

          <h2 className="mt-8 font-display text-2xl text-ink-900 dark:text-ink-50">
            How we use it
          </h2>
          <ul className="ml-5 list-disc space-y-2">
            <li>To generate your fragrance recommendations.</li>
            <li>
              To email you pilot updates or notify you when new features ship
              (only if you opted in).
            </li>
            <li>To understand aggregate usage and improve the product.</li>
          </ul>

          <h2 className="mt-8 font-display text-2xl text-ink-900 dark:text-ink-50">
            Third parties
          </h2>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              We may call an LLM provider (OpenAI or Anthropic) with your
              recommendation context (no email). Their privacy policies apply.
            </li>
            <li>
              Our &ldquo;Where to buy&rdquo; links are affiliate links to
              Amazon, Sephora, FragranceNet, and The Perfumed Court. We earn a
              small commission on qualifying purchases. The retailers set their
              own cookies and privacy terms.
            </li>
          </ul>

          <h2 className="mt-8 font-display text-2xl text-ink-900 dark:text-ink-50">
            Your rights
          </h2>
          <p>
            Email us at{" "}
            <a
              href="mailto:hello@scentsense.ai"
              className="underline hover:text-accent-deep dark:hover:text-accent"
            >
              hello@scentsense.ai
            </a>{" "}
            to request access, correction, or deletion of your data.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
