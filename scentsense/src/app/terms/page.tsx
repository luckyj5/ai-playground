import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Terms of use for ScentSense AI.",
};

const LAST_UPDATED = "Pilot launch";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <span className="eyebrow">Terms</span>
        <h1 className="display mt-3 text-4xl text-ink-900 dark:text-ink-50 sm:text-5xl">
          Terms of service
        </h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">
          Last updated: {LAST_UPDATED}
        </p>

        <section className="mt-8 space-y-6 text-ink-700 dark:text-ink-100">
          <p>
            ScentSense AI is a fragrance recommendation tool provided
            &ldquo;as-is&rdquo; during an invite-only pilot. By using the
            service you accept these terms.
          </p>

          <h2 className="mt-8 font-display text-2xl text-ink-900 dark:text-ink-50">
            Recommendations are suggestions, not advice
          </h2>
          <p>
            Our recommendations are AI-assisted and curated for general taste.
            They are not medical, allergy, or dermatological advice. Always
            sample a fragrance on your skin before committing to a full bottle,
            and consult a doctor about any sensitivities.
          </p>

          <h2 className="mt-8 font-display text-2xl text-ink-900 dark:text-ink-50">
            Affiliate disclosure
          </h2>
          <p>
            Our &ldquo;Where to buy&rdquo; panel contains affiliate links. We
            may earn a small commission on qualifying purchases at no extra
            cost to you. We do not own the retailers and are not responsible
            for their availability, pricing, shipping, or returns.
          </p>

          <h2 className="mt-8 font-display text-2xl text-ink-900 dark:text-ink-50">
            Acceptable use
          </h2>
          <p>
            Don&apos;t attempt to scrape, overload, or reverse-engineer the
            service, and don&apos;t submit other people&apos;s emails without
            consent.
          </p>

          <h2 className="mt-8 font-display text-2xl text-ink-900 dark:text-ink-50">
            Limitation of liability
          </h2>
          <p>
            To the maximum extent permitted by law, ScentSense AI and its
            operators are not liable for indirect, incidental, or consequential
            damages arising from your use of the service.
          </p>

          <h2 className="mt-8 font-display text-2xl text-ink-900 dark:text-ink-50">
            Contact
          </h2>
          <p>
            Questions?{" "}
            <a
              href="mailto:hello@scentsense.ai"
              className="underline hover:text-accent-deep dark:hover:text-accent"
            >
              hello@scentsense.ai
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
