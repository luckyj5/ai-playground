"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ExampleOutputs from "@/components/ExampleOutputs";
import SocialProof from "@/components/SocialProof";
import EmailCapture from "@/components/EmailCapture";
import Footer from "@/components/Footer";
import { track } from "@/lib/analytics";

export default function LandingPage() {
  useEffect(() => {
    track("landing_view");
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ExampleOutputs />
        <SocialProof />

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="card relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
              <div>
                <span className="eyebrow">Join the list</span>
                <h2 className="display mt-3 text-4xl text-ink-900 dark:text-ink-50 sm:text-5xl">
                  Get the next drop,
                  <br />
                  before it sells out.
                </h2>
                <p className="mt-4 max-w-md text-ink-600 dark:text-ink-200">
                  Weekly fragrance picks, niche house deep-dives, and early
                  access to new features. One email. No spam, ever.
                </p>
              </div>
              <EmailCapture />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
