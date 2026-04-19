export default function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Tell us the moment",
      body: "Occasion, weather, and the vibe you want to carry. Sixty seconds, tops.",
    },
    {
      n: "02",
      title: "We read between the notes",
      body: "A reasoning model cross-checks your context against a curated fragrance library — no generic answers.",
    },
    {
      n: "03",
      title: "Wear presence",
      body: "Two or three recommendations with a reason, a moment, and a place to buy.",
    },
  ];
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl px-6 py-20 sm:py-28"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">How it works</span>
          <h2 className="display mt-3 text-4xl text-ink-900 dark:text-ink-50 sm:text-5xl">
            Three steps. One
            <br />
            signature moment.
          </h2>
        </div>
        <p className="max-w-sm text-ink-600 dark:text-ink-200">
          No quiz fatigue, no guesswork. Just a concierge that thinks like a
          perfumer and a stylist.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="card">
            <span className="font-display text-4xl text-accent-deep dark:text-accent">
              {s.n}
            </span>
            <h3 className="mt-3 font-display text-2xl text-ink-900 dark:text-ink-50">
              {s.title}
            </h3>
            <p className="mt-2 text-ink-600 dark:text-ink-200">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
