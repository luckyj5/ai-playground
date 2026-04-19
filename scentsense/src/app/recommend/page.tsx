import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecommendationFlow from "@/components/RecommendationFlow";

export const metadata: Metadata = {
  title: "Get your recommendation",
  description:
    "Tell ScentSense AI the occasion, weather, and vibe — get two or three fragrance picks crafted for the moment.",
};

export default function RecommendPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <div className="mb-10 text-center">
          <span className="eyebrow">The concierge</span>
          <h1 className="display mt-3 text-4xl text-ink-900 dark:text-ink-50 sm:text-5xl">
            Tell us the moment.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-600 dark:text-ink-200">
            Five quick taps. A scent picked for exactly where you&apos;re going.
          </p>
        </div>
        <RecommendationFlow />
      </main>
      <Footer />
    </>
  );
}
